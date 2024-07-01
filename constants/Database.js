import * as FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite'

const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('feelio.db')
  console.log(`Database path: ${FileSystem.documentDirectory}SQLite/feelio.db`)
  await db.execAsync('PRAGMA journal_mode = WAL')
  await db.execAsync('PRAGMA foreign_keys = ON')
  return db
}

const initializeDatabase = async () => {
  const db = await openDatabase()
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.execAsync(`
       CREATE TABLE IF NOT EXISTS diary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        year INTEGER,
        month INTEGER,
        day INTEGER,
        hour INTEGER,
        minute INTEGER,
        monthname TEXT,
        timestamp TEXT
      );  
    `)
  })
  return db
}

const insertDiary = async (
  title,
  content,
  year,
  month,
  day,
  hour,
  minute,
  monthname,
  timestamp,
) => {
  const db = await openDatabase()
  const result = await db.runAsync(
    'INSERT INTO diary (title, content, year, month, day, hour, minute, monthname, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    title,
    content,
    year,
    month,
    day,
    hour,
    minute,
    monthname,
    timestamp,
  )
  const firstRow = await db.getFirstAsync(
    'SELECT * FROM diary WHERE id=?',
    result.lastInsertRowId,
  )
  return firstRow
}

const updateDiary = async (id, title, content) => {
  const db = await openDatabase()
  await db.runAsync(
    'UPDATE diary SET title=?, content=? WHERE id=?',
    title,
    content,
    id,
  )
  console.log('UPDATED DIARY:', {
    title,
    content,
    id,
  })
}

const getAllDiaries = async (year, month) => {
  const db = await openDatabase()
  const results = []
  const allRows = await db.getAllAsync('SELECT * FROM diary')
  for (const row of allRows) {
    results.push(row)
  }
  return results
}

const getDiary = async (id) => {
  const db = await openDatabase()
  const firstRow = await db.getFirstAsync(
    'SELECT * FROM diary WHERE id = ?',
    id,
  )
  return firstRow
}

const deleteDiaryById = async (id) => {
  const db = await openDatabase()
  // await db.withExclusiveTransactionAsync(async (txn) => {
  //   await txn.execAsync('DELETE FROM diary WHERE id = ?', id)
  // })
  await db.runAsync('DELETE FROM diary WHERE id = $id', { $id: id })
}

const clearTable = async (tableName) => {
  const db = await openDatabase()
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.execAsync(`DELETE FROM ${tableName}`)
  })
}

export {
  clearTable,
  deleteDiaryById,
  getAllDiaries,
  getDiary,
  initializeDatabase,
  insertDiary,
  updateDiary,
}
