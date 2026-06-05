"""
Skills extractor — extracts technical and soft skills from resume text.
"""

import re
from typing import List

SKILLS_LIST = [
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "c",
    "ruby", "php", "swift", "kotlin", "go", "rust", "scala", "r",
    "matlab", "perl", "bash", "shell", "assembly", "assembly language",
    "vhdl", "verilog", "systemverilog", "tcl", "fortran", "cobol",
    "haskell", "erlang", "elixir", "clojure", "f#", "ocaml", "lisp",
    "prolog", "ada", "d", "nim", "zig", "julia", "groovy", "dart",
    "lua", "racket", "scheme", "smalltalk", "abap", "apex", "solidity",
    "cuda", "opencl", "opengl", "webgl", "hlsl", "glsl", "wgsl",
    "powershell", "batch", "makefile", "cmake", "gradle", "maven",

    # Web Frontend
    "react", "angular", "vue", "next.js", "nuxt", "svelte", "gatsby",
    "remix", "astro", "solid.js", "alpine.js", "htmx", "jquery",
    "bootstrap", "tailwind css", "material ui", "ant design", "chakra ui",
    "shadcn", "radix ui", "styled components", "sass", "less", "css",
    "html", "html5", "css3", "webpack", "vite", "parcel", "rollup",
    "babel", "eslint", "prettier", "storybook", "chromatic",
    "web components", "pwa", "service workers", "web assembly",
    "responsive design", "accessibility", "seo", "web performance",

    # Web Backend
    "fastapi", "django", "flask", "express", "nestjs", "spring boot",
    "laravel", "rails", "asp.net", "phoenix", "gin", "fiber", "echo",
    "fastify", "hapi", "koa", "strapi", "payload", "directus",
    "graphql", "rest api", "grpc", "websockets", "webhooks",
    "oauth", "jwt", "openid", "saml", "api gateway", "swagger",
    "openapi", "postman", "insomnia", "httpie",

    # Databases
    "postgresql", "mysql", "mongodb", "redis", "sqlite", "oracle",
    "cassandra", "elasticsearch", "dynamodb", "firebase", "supabase",
    "mariadb", "neo4j", "influxdb", "cockroachdb", "snowflake",
    "bigquery", "redshift", "aurora", "planetscale", "neon",
    "couchdb", "rethinkdb", "arangodb", "dgraph", "tigergraph",
    "clickhouse", "druid", "pinot", "timescaledb", "questdb",
    "vector database", "pinecone", "weaviate", "chroma", "qdrant",
    "milvus", "faiss", "annoy", "hnsw", "sql", "nosql", "newsql",
    "database design", "data modeling", "normalization", "indexing",
    "query optimization", "stored procedures", "triggers", "views",

    # Cloud & Infrastructure
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
    "ansible", "jenkins", "github actions", "gitlab ci", "circleci",
    "travis ci", "teamcity", "bamboo", "argocd", "flux", "helm",
    "istio", "envoy", "consul", "vault", "nomad", "packer",
    "cloudformation", "pulumi", "crossplane", "operator framework",
    "nginx", "apache", "caddy", "traefik", "haproxy", "keepalived",
    "cloudflare", "heroku", "vercel", "netlify", "railway", "render",
    "fly.io", "digital ocean", "linode", "vultr", "hetzner",
    "aws ec2", "aws s3", "aws lambda", "aws rds", "aws eks",
    "aws ecs", "aws fargate", "aws sqs", "aws sns", "aws api gateway",
    "azure devops", "azure functions", "azure blob", "azure aks",
    "gke", "gcs", "cloud run", "cloud functions", "pub/sub",
    "prometheus", "grafana", "elk stack", "datadog", "new relic",
    "splunk", "jaeger", "zipkin", "opentelemetry", "sentry",
    "ci/cd", "devops", "devsecops", "gitops", "infrastructure as code",
    "site reliability engineering", "sre", "chaos engineering",

    # ML & Data Science
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "matplotlib", "seaborn", "plotly", "bokeh", "altair",
    "hugging face", "opencv", "keras", "xgboost", "lightgbm",
    "catboost", "random forest", "svm", "gradient boosting",
    "neural networks", "transformers", "bert", "gpt", "llm",
    "data analysis", "data science", "data engineering",
    "feature engineering", "feature selection", "dimensionality reduction",
    "pca", "t-sne", "umap", "clustering", "k-means", "dbscan",
    "classification", "regression", "time series forecasting",
    "anomaly detection", "recommendation systems", "collaborative filtering",
    "model deployment", "mlops", "mlflow", "wandb", "dvc",
    "airflow", "spark", "hadoop", "hive", "pig", "kafka",
    "flink", "beam", "dask", "ray", "rapids", "cudf",
    "tableau", "power bi", "looker", "metabase", "superset",
    "statistics", "linear algebra", "calculus", "probability",
    "bayesian inference", "hypothesis testing", "a/b testing",
    "reinforcement learning", "generative ai", "langchain", "rag",
    "llama", "stable diffusion", "midjourney", "dall-e",
    "vector embeddings", "semantic search", "fine-tuning",
    "prompt engineering", "chain of thought", "few-shot learning",
    "transfer learning", "federated learning", "active learning",
    "data augmentation", "synthetic data", "data labeling",
    "object detection", "yolo", "rcnn", "detr", "sam",
    "image segmentation", "pose estimation", "ocr", "tesseract",
    "speech recognition", "text to speech", "whisper",
    "sentiment analysis", "named entity recognition", "ner",
    "text classification", "summarization", "translation",
    "question answering", "information retrieval",

    # Embedded & Hardware
    "arduino", "raspberry pi", "esp32", "esp8266", "stm32",
    "atmel studio", "proteus", "keil", "mplab", "platformio",
    "embedded c", "embedded systems", "rtos", "freertos",
    "zephyr", "mbed", "riot os", "contiki", "threadx",
    "microcontroller", "microprocessor", "fpga", "cpld", "asic",
    "avr", "arm", "arm cortex", "pic", "msp430", "nrf52",
    "atmega", "atmega328p", "atmega32", "stm32f4", "stm32f103",
    "i2c", "spi", "uart", "usart", "can bus", "modbus",
    "rs232", "rs485", "lin bus", "ethernet", "wifi", "bluetooth",
    "zigbee", "lora", "lorawan", "nb-iot", "lte-m", "5g",
    "jtag", "swd", "openocd", "gdb", "debugger",
    "oscilloscope", "logic analyzer", "multimeter", "function generator",
    "spectrum analyzer", "network analyzer", "soldering", "pcb assembly",
    "interrupt handling", "dma", "timer", "pwm", "adc", "dac",
    "bootloader", "firmware", "ota update", "memory management",
    "real time systems", "bare metal programming",

    # Electrical Engineering
    "circuit analysis", "digital logic design", "power systems",
    "power electronics", "control systems", "signals and systems",
    "electromagnetic fields", "emft", "communication systems",
    "vlsi", "analog circuits", "digital circuits", "op-amp",
    "ltspice", "etap", "pscad", "simulink", "cadence", "multisim",
    "pcb design", "altium", "eagle", "kicad", "autocad electrical",
    "load flow", "power distribution", "transformers", "motors",
    "plc", "scada", "hmi", "relay protection", "switchgear",
    "renewable energy", "solar", "wind energy", "battery systems",
    "hvdc", "facts", "smart grid", "microgrid", "energy storage",
    "electric vehicles", "ev charging", "power management",
    "dc-dc converter", "inverter", "rectifier", "chopper",
    "pid control", "state space", "transfer function", "bode plot",
    "nyquist", "root locus", "kalman filter", "observer design",
    "rf engineering", "antenna design", "microwave", "radar",
    "fiber optics", "photonics", "laser", "led", "photodetector",
    "semiconductor", "diode", "transistor", "mosfet", "igbt",
    "instrumentation", "sensors", "actuators", "transducers",
    "data acquisition", "daq", "labview", "ni instruments",
    "protective relaying", "grounding", "insulation coordination",
    "power quality", "harmonics", "power factor correction",
    "vfd", "servo drive", "motion control", "cnc",

    # Networking & Security
    "cisco", "networking", "tcp/ip", "dns", "dhcp", "vpn",
    "firewall", "cybersecurity", "ethical hacking", "penetration testing",
    "wireshark", "nmap", "metasploit", "burp suite", "ccna", "ccnp",
    "network security", "cryptography", "ssl", "tls", "ipsec",
    "zero trust", "siem", "soc", "threat hunting", "incident response",
    "malware analysis", "reverse engineering", "forensics",
    "owasp", "vulnerability assessment", "cve", "exploit development",
    "social engineering", "phishing", "red team", "blue team",
    "ids", "ips", "waf", "dlp", "endpoint security",
    "pki", "certificates", "hsm", "key management",
    "network protocols", "bgp", "ospf", "eigrp", "spanning tree",
    "vlan", "routing", "switching", "load balancing", "qos",
    "sd-wan", "nfv", "sdn", "openflow", "p4",
    "5g networks", "lte", "wifi 6", "wimax", "satellite",

    # Robotics & Automation
    "robotics", "ros", "ros2", "gazebo", "rviz", "moveit",
    "robot kinematics", "path planning", "slam", "lidar",
    "sensor fusion", "servo motors", "stepper motors", "dc motors",
    "encoders", "autonomous systems", "drone", "uav", "manipulator",
    "inverse kinematics", "forward kinematics", "motion planning",
    "trajectory planning", "collision avoidance", "navigation",
    "gmapping", "cartographer", "rtab-map", "amcl",
    "computer vision for robotics", "point cloud", "pcl",
    "depth camera", "stereo vision", "structure from motion",
    "simultaneous localization and mapping", "visual odometry",
    "force control", "impedance control", "admittance control",
    "haptics", "teleoperation", "human robot interaction",
    "collaborative robot", "cobot", "industrial robot",
    "mobile robot", "legged robot", "underwater robot",
    "space robotics", "surgical robot", "rehabilitation robot",
    "robot operating system", "real time control", "embedded ros",

    # Software Engineering & CS
    "data structures", "algorithms", "object oriented programming",
    "functional programming", "reactive programming", "event driven",
    "design patterns", "solid principles", "dry", "kiss", "yagni",
    "system design", "software architecture", "microservices",
    "monolith", "serverless", "event sourcing", "cqrs",
    "domain driven design", "ddd", "clean architecture",
    "hexagonal architecture", "clean code", "refactoring",
    "code review", "pair programming", "mob programming",
    "agile", "scrum", "kanban", "xp", "lean", "safe",
    "tdd", "bdd", "atdd", "unit testing", "integration testing",
    "end to end testing", "performance testing", "load testing",
    "selenium", "cypress", "playwright", "jest", "pytest",
    "mocha", "jasmine", "junit", "testng", "nunit",
    "distributed systems", "cap theorem", "consistency",
    "availability", "partition tolerance", "eventual consistency",
    "message queue", "kafka", "rabbitmq", "activemq", "zeromq",
    "cache", "cdn", "rate limiting", "circuit breaker",
    "service mesh", "api design", "versioning", "documentation",
    "operating systems", "linux", "windows", "macos", "unix",
    "kernel", "process management", "memory management",
    "file systems", "virtualization", "containerization",
    "computer networks", "compilers", "interpreters", "parsers",
    "lexers", "ast", "llvm", "gcc", "clang",
    "database management", "transaction", "acid", "isolation levels",
    "discrete mathematics", "graph theory", "number theory",
    "complexity theory", "np hard", "dynamic programming",
    "greedy algorithms", "divide and conquer", "backtracking",
    "searching", "sorting", "hashing", "trees", "graphs",
    "linked lists", "stacks", "queues", "heaps", "tries",

    # Mobile Development
    "android", "ios", "react native", "flutter", "xamarin",
    "ionic", "cordova", "capacitor", "expo", "kotlin multiplatform",
    "swift ui", "jetpack compose", "android studio", "xcode",
    "mobile ui", "push notifications", "app store", "play store",
    "mobile security", "offline first", "mobile performance",

    # Game Development
    "unity", "unreal engine", "godot", "pygame", "monogame",
    "game design", "game physics", "shader programming",
    "3d modeling", "blender", "maya", "3ds max", "zbrush",
    "animation", "rigging", "texturing", "uv mapping",
    "multiplayer", "networking for games", "game ai",
    "procedural generation", "voxel", "ray tracing",

    # Tools & Productivity
    "git", "github", "gitlab", "bitbucket", "svn",
    "visual studio code", "visual studio", "pycharm", "intellij",
    "eclipse", "netbeans", "jupyter", "google colab", "anaconda",
    "postman", "swagger", "figma", "sketch", "adobe xd",
    "jira", "confluence", "notion", "obsidian", "trello",
    "asana", "linear", "clickup", "monday", "basecamp",
    "slack", "teams", "discord", "zoom", "meet",
    "latex", "markdown", "technical writing", "documentation",

    # Soft Skills
    "leadership", "communication", "teamwork", "problem solving",
    "project management", "time management", "critical thinking",
    "presentation", "research", "analytical thinking",
    "creativity", "innovation", "adaptability", "flexibility",
    "attention to detail", "organization", "planning",
    "mentoring", "coaching", "conflict resolution",
    "negotiation", "stakeholder management", "client management",
    "agile leadership", "product thinking", "user empathy",
]


def extract_skills(text: str) -> List[str]:
    """
    Extract skills from resume text by matching against skills taxonomy.
    Returns a deduplicated list of matched skills.
    """
    text_lower = text.lower()
    found_skills = []

    for skill in SKILLS_LIST:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text_lower):
            found_skills.append(skill)

    return list(dict.fromkeys(found_skills))