import model from '../models';
const {
  Files
} = model;

class FilesService {
  /**
   * @param {Object} data Object of inserted data
   * @return {Object} file Inserted file from database
   */
  static insertFile(data) {
    return Files.create(data)
      .then(file => {
        return file;
      })
  }
}
export default FilesService;
