import { glob } from 'glob';
import fs from 'fs-extra';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { CohereClient } from 'cohere-ai';
import { QdrantClient } from '@qdrant/js-client-rest';
import 'dotenv/config';

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const qdrant = new QdrantClient({ 
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = 'humanoid-robotics-book';

async function main() {
    console.log("Starting content processing...");

    // T003: Extract and clean content
    const files = await glob('my-website/docs/**/*.md*');
    console.log(`Found ${files.length} content files.`);

    const documents = [];
    for (const file of files) {
        const content = await fs.readFile(file, 'utf-8');
        const text = await remark().use(strip).process(content);
        documents.push({
            text: String(text),
            metadata: {
                source: file,
            }
        });
    }
    console.log("Finished reading and cleaning all files.");
    
    // T004: Text Chunking
    const chunks = [];
    for(const doc of documents) {
        const sentences = doc.text.split(/(?<=[.?!])\s+/);
        let currentChunk = '';
        for(const sentence of sentences) {
            if(currentChunk.length + sentence.length > 800) {
                chunks.push({ text: currentChunk.trim(), metadata: doc.metadata });
                currentChunk = '';
            }
            currentChunk += sentence + ' ';
        }
        if(currentChunk) {
            chunks.push({ text: currentChunk.trim(), metadata: doc.metadata });
        }
    }
    console.log(`Created ${chunks.length} chunks.`);

    // T005: Generate Embeddings with batching
    console.log("Generating embeddings with Cohere...");
    const batchSize = 90;
    let allEmbeddings = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batchChunks = chunks.slice(i, i + batchSize);
        const textsToEmbed = batchChunks.map(chunk => chunk.text);
        console.log(`Processing batch ${i / batchSize + 1}...`);
        const response = await cohere.embed({
            texts: textsToEmbed,
            model: "embed-english-v3.0",
            inputType: "search_document",
        });
        allEmbeddings.push(...response.embeddings);
    }
    console.log("Embeddings generated.");

    // T006: Qdrant Setup
    console.log("Setting up Qdrant collection...");
    // Use createCollection to avoid errors if it already exists, with a check first
    const collections = await qdrant.getCollections();
    const collectionExists = collections.collections.some(c => c.name === COLLECTION_NAME);
    if (!collectionExists) {
        await qdrant.createCollection(COLLECTION_NAME, {
            vectors: {
                size: 1024, // As per embed-english-v3.0
                distance: "Cosine",
            },
        });
        console.log("Qdrant collection created.");
    } else {
        console.log("Qdrant collection already exists.");
    }


    // T007: Store Vectors
    console.log("Storing vectors in Qdrant...");
    await qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        points: chunks.map((chunk, i) => ({
            id: i,
            vector: allEmbeddings[i],
            payload: { ...chunk.metadata, text: chunk.text },
        })),
    });
    console.log("Vectors stored successfully.");
    console.log("Content processing complete.");
}

main().catch(console.error);