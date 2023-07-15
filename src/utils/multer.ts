import multer from 'multer'
import path from 'path'

export default () => multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    },
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
  }),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("File type is not supported"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10000000 // 10 mb
  }
})

