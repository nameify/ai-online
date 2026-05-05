// redis.helper.js
import { createClient } from "redis";

let client;

export async function connectRedis() {
  if (client) return client; // prevent multiple connections

  client = createClient({
    url: process.env.REDIS_URL, // use env variable
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error("Redis retry attempts exhausted");
          return new Error("Retry attempts exhausted");
        }
        return Math.min(retries * 100, 3000);
      },
    },
  });

  client.on("error", (err) => {
    console.error("Redis Error:", err);
  });

  client.on("connect", () => {
    console.log("Redis Connected");
  });

  await client.connect();

  return client;
}

export function getRedisClient() {
  if (!client) {
    throw new Error("Redis not initialized. Call connectRedis() first.");
  }
  return client;
}

export function parseWhoisResponse(whoisApiData) {
  const record = whoisApiData?.data?.WhoisRecord;
  if (!record) return null;

  const registry = record.registryData;

  return {
    domain: registry?.domainName || record?.domainName,
    tld: record?.domainNameExt,
    registrationDate: registry?.createdDateNormalized || registry?.createdDate,
    lastUpdated: registry?.updatedDateNormalized || registry?.updatedDate,
    nameServers: registry?.nameServers || [],
    whoisServer: registry?.whoisServer,
    estimatedAgeDays: record?.estimatedDomainAge,
    rawWhois: registry?.rawText,
    strippedText: registry?.strippedText,
  };
}
