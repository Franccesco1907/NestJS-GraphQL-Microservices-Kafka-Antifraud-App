export interface Environment {
  apiPort: number;
  environment: string;
  timeout: number;
  cors: CorsConfig;
  database: DataBaseConfig;
  transactionKafka: KafkaConfig;
  antifraudKafka: KafkaConfig;
}

export interface CorsConfig {
  origin: string[];
  methods: string;
  allowedHeaders: string;
  exposedHeaders: string;
  credentials: boolean;
}

export interface DataBaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export interface KafkaConfig {
  host: string;
  name: string;
  clientId: string;
  groupId: string;
}
