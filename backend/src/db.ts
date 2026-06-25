import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const DB_PATH = process.env.DB_PATH ?? './data/domingol.db'

// Asegura que el directorio data/ exista
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    nickname    TEXT,
    age         INTEGER,
    position    TEXT NOT NULL,
    foot        TEXT NOT NULL,
    rating      INTEGER NOT NULL DEFAULT 70,
    ritmo       INTEGER NOT NULL DEFAULT 70,
    pase        INTEGER NOT NULL DEFAULT 70,
    tiro        INTEGER NOT NULL DEFAULT 70,
    fisico      INTEGER NOT NULL DEFAULT 70,
    entrada     INTEGER NOT NULL DEFAULT 70,
    vision      INTEGER NOT NULL DEFAULT 70,
    photo       TEXT,
    stat_matches  INTEGER DEFAULT 0,
    stat_wins     INTEGER DEFAULT 0,
    stat_losses   INTEGER DEFAULT 0,
    stat_draws    INTEGER DEFAULT 0,
    stat_goals    INTEGER DEFAULT 0,
    stat_assists  INTEGER DEFAULT 0,
    stat_mvp      INTEGER DEFAULT 0,
    created_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS matches (
    id       TEXT PRIMARY KEY,
    date     TEXT NOT NULL,
    team_a   TEXT NOT NULL,
    team_b   TEXT NOT NULL,
    result   TEXT,
    winner   TEXT,
    mvp_id   TEXT
  );
`)
