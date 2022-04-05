const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require('url');
const path = require('path');

let mainWindow;
let newProductWindow;

if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  });
}


app.on('ready', () => {

  mainWindow = new BrowserWindow({
    width: 720,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file',
    slashes: true,
  }))

  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', () => {
    app.quit();
  });

});

function createNewProductWindow() {
  newProductWindow = new BrowserWindow({
    width: 400,
    height: 330,
    title: 'Add A New Product',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  newProductWindow.setMenu(null);

  newProductWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/new-product.html'),
    protocol: 'file',
    slashes: true
  }));
  newProductWindow.on('closed', () => {
    newProductWindow = null;
  });
}

ipcMain.on('product:new', (e, newProduct) => {
  console.log(newProduct);
  mainWindow.webContents.send('product:new', newProduct);
  newProductWindow.close();
});

const templateMenu = [
  {
    label: 'Archivo',
    submenu: [
      {
        label: 'Nuevo Producto',
        accelerator: 'Ctrl+N',
        click() {
          createNewProductWindow();
        }
      },
      {
        label: 'Borrar todos los Productos',
        click() {
          mainWindow.webContents.send('products:remove-all');
        }
      },
      {
        label: 'Salir',
        accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform === 'darwin') {
  templateMenu.unshift({
    label: app.getName(),
  });
};

if (process.env.NODE_ENV !== 'production') {
  templateMenu.push({
    label: 'DevTools',
    submenu: [
      {
        label: 'Mostrar/Ocultar DevTools',
        accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}