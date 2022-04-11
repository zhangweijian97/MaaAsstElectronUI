import { app, ipcMain } from 'electron'
import { Assistant } from '@main/core'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'

type PathName =
  'home' |
  'appData' |
  'userData' |
  'cache' |
  'temp' |
  'exe' |
  'module' |
  'desktop' |
  'documents' |
  'downloads' |
  'music' |
  'pictures' |
  'videos' |
  'recent' |
  'logs' |
  'crashDumps'

export default function usePathHooks (): void {
  ipcMain.handle('path:app', async (event, name: PathName) => {
    return app.getPath(name)
  })

  ipcMain.handle('path:asst', async (event) => {
    return Assistant.libPath
  })

  ipcMain.handle('path:adb', async (event) => {
    const dir = path.join(app.getPath('appData'), app.getName(), 'adb')
    if (existsSync(dir)) mkdirSync(dir)
    return dir
  })
}
