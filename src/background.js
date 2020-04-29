'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray
} from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
const path = require('path')




// var drag = require('electron-drag');
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let willQuitApp = false
let isShow = false

let isMac = process.platform === 'darwin'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

function createTray() {
  const appIconPath = path.join(__dirname, './../public/favicon.png')
  const appTray = new Tray(appIconPath)
  appTray.on('click', () => {
    app.emit('activate')
  })
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 900,
    height: 675,
    frame: false,
    titleBarStyle: 'hiddenInset', // 隐藏了标题栏的窗口
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // 监听窗口将要关闭事件
  win.on('close', (event) => {
    if (willQuitApp) {
      win = null;
      return null
    }
    event.preventDefault();
    win.hide();
    isShow = false
  });

  // 窗口关闭的监听  
  win.on('closed', (event) => {
    win = null;
  });

  // 创建托盘
  createTray()
}

// Quit when all windows are closed.
app.on('window-all-closed', (e) => {

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }

})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (win === null) {
    createWindow()
  } else {
    !isShow && win.show()
  }
})

// 设置程序退出标识
app.on('before-quit', () => {
  willQuitApp = true
})


// 自定义应用菜单
function createMenu() {
  const template = [{
      label: 'Edit',
      submenu: [{
          label: 'Undo' // 菜单显示的label
        },
        {
          label: 'Redo'
        },
        {
          type: 'separator' // 菜单分割线
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
      ]
    },
    {
      label: 'View',
      submenu: [{
          label: 'Reload'
        },
        {
          type: 'separator'
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function () {
            // 设置快捷键
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F'
            } else {
              return 'F11'
            }
          })(),
          click: function (item, focusedWindow) {
            // 设置菜单对应的click事件
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          }

        }
      ]
    },
    {
      label: 'Windows',
      role: 'window',
      submenu: [{
          // label: 'minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        }, {
          role: 'zoom'
        },
        ...(isMac ? [{
            type: 'separator'
          },
          {
            role: 'front'
          },
          {
            type: 'separator'
          },
          {
            role: 'window'
          }
        ] : [{
          role: 'close'
        }])
      ]
    }
  ];

  if (isMac) {
    template.unshift({
      label: app.getName(),
      submenu: [{
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          type: 'separator'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    });
  }

  const appMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(appMenu);

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createMenu()
  // createTray()
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
  // Menu.setApplicationMenu(null);

  if (process.platform !== 'darwin') {
    app.dock.hide();
  }
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}