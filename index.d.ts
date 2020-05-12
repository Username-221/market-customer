import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SignOptions } from 'jsonwebtoken';
import { Model, Document, Connection, ConnectionOptions } from 'mongoose';
import Mail from 'nodemailer/lib/mailer';
import { Server } from 'http';
import { Logger } from 'winston';

export as namespace types;

interface DBConfig extends ConnectionOptions {
  uri: string;
}

interface AuthConfig {
  secret: string;
  saltSize: number;
  digest: string;
  jwtOptions: SignOptions;
}

export interface ProjectConfig {
  auth: AuthConfig;
  db: DBConfig;
  smtp: {
    host: string;
    restorePath: string;
    transport: SMTPTransport | SMTPTransport.Options;
  };
}

type MongooseModel = Model<Document, {}>;

export interface DependencyContainer {
  ProductModel: MongooseModel;
  UserModel: MongooseModel;
  RefreshTokenModel: MongooseModel;
  OrderModel: MongooseModel;
  CartModel: MongooseModel;
  emailTransport: Mail;
  logger: Logger;
}

export interface GracefulShutdown {
  server: Server;
  dbs: Connection[];
  logger: Logger;
}
