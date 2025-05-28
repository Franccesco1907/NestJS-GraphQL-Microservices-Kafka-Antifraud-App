export interface Environment {
  apiPort: number;
  environment: string;
  timeout: number;
  cors: CorsConfig;
  antifraudKafka: KafkaConfig,
}

export interface CorsConfig {
  origin: string[];
  methods: string;
  allowedHeaders: string;
  exposedHeaders: string;
  credentials: boolean;
}

export interface KafkaConfig {
  host: string;
  name: string;
  clientId: string;
  groupId: string;
}
