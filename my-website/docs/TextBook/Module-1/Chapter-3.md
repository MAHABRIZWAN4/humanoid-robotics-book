# Chapter 3: ROS 2 Nodes, Topics, Services, and Actions

This chapter dives into the core communication concepts of ROS 2: **Nodes**, **Topics**, **Services**, and **Actions**. These are the fundamental building blocks that allow different parts of your robot's software to talk to each other and work together.

## Nodes: The Workers of the Robot

In ROS 2, a **Node** is essentially an executable program that performs a specific task. Think of it like a specialized worker in a factory. Each node should ideally have a single responsibility, making the system modular and easier to manage.

**Examples of Nodes:**
*   A `camera_node` that reads images from a camera sensor.
*   A `motor_control_node` that sends commands to the robot's motors.
*   A `navigation_node` that plans paths for the robot.
*   A `human_detection_node` that processes camera images to find people.

A complex robot system will have many nodes, all running simultaneously and communicating to achieve the robot's goals.

## Topics: The Broadcast Channels

**Topics** are the most common way for nodes to exchange data in a ROS 2 system. When a node wants to share information, it "publishes" messages to a specific topic. Any other node interested in that information can "subscribe" to that topic to receive the messages. It's a one-to-many, asynchronous communication model, much like a radio broadcast.

**Key characteristics of Topics:**
*   **Publisher/Subscriber**: One or more nodes publish data, and one or more nodes subscribe to receive that data.
*   **Asynchronous**: Publishers don't wait for subscribers to receive messages. They just send them out.
*   **Data Streams**: Topics are best for continuous streams of data, like sensor readings (camera images, lidar scans), odometry data (robot's position), or motor status.

**Real-world example**: A `lidar_node` might publish laser scan data to a topic named `/scan`. A `navigation_node` and a `mapping_node` could both subscribe to `/scan` to get this data for their respective tasks.

## Services: The Request-Response Mechanism

While topics are great for continuous data, sometimes you need a node to perform a specific task and then report back the result. This is where **Services** come in. A service defines a request-response interaction between two nodes. One node acts as the "client" that sends a request, and another node acts as the "server" that processes the request and sends back a response. It's a one-to-one, synchronous communication.

**Key characteristics of Services:**
*   **Client/Server**: One node sends a request, one node sends a response.
*   **Synchronous**: The client typically waits for the server's response.
*   **Specific Tasks**: Best for operations that need a clear start and end, like "get current robot position", "trigger emergency stop", or "move arm to pose X".

**Real-world example**: A `robot_manager_node` might be a client that calls a service on a `gripper_control_node` with the request "open gripper". The `gripper_control_node` (server) performs the action and responds with "gripper opened successfully".

## Actions: Long-Running Goal-Based Tasks

**Actions** in ROS 2 are designed for long-running tasks that provide periodic feedback and can be preempted (cancelled). They combine aspects of both topics and services. An action client sends a "goal" to an action server, which then provides "feedback" as it processes the goal, and finally sends a "result" when the goal is completed or aborted.

**Key characteristics of Actions:**
*   **Goal-oriented**: Used for complex tasks with a desired outcome.
*   **Feedback**: Client receives updates on the progress of the task.
*   **Preemptable**: Client can cancel the task if needed.
*   **Asynchronous (Client side)**: The client doesn't block while the server is working on the goal.

**Real-world example**: A `robot_commander_node` might send an action goal "navigate to kitchen" to a `navigation_action_server`. The server would then send feedback like "moving towards living room", "approaching kitchen", and finally "arrived at kitchen" as a result. If a human intervenes, the commander can send a "cancel" request.

Understanding nodes, topics, services, and actions is crucial for designing and implementing robust robotic systems with ROS 2. In the next chapter, we'll see how Python agents can be integrated into this communication framework using `rclpy`.
