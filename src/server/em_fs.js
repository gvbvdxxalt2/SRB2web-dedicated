var fs = require("fs");
var path = require("path");

function createCustomNodeFS(FS) {
  return {
    mount: function (mount) {
      // The root node of the mounted filesystem
      return FS.createNode(null, "/", 16895 /* DIR_MODE */, 0);
    },

    createNode: function (parent, name, mode, dev) {
      if (!FS.isDir(mode) && !FS.isFile(mode)) {
        throw new FS.ErrnoError(28); // EPERM
      }

      const node = FS.createNode(parent, name, mode, dev);
      node.node_ops = FS.isDir(mode) ? this.node_ops.directory : this.node_ops.file;
      node.stream_ops = FS.isDir(mode) ? this.stream_ops.directory : this.stream_ops.file;
      return node;
    },

    // Map Emscripten virtual node path to host disk path
    realPath: function (node) {
      const parts = [];
      while (node.parent !== node) {
        parts.push(node.name);
        node = node.parent;
      }
      parts.reverse();
      // Mount options contain the real host root directory
      const mountRoot = node.mount.opts.root;
      return path.join(mountRoot, ...parts);
    },

    node_ops: {
      directory: {
        lookup: function (parent, name) {
          const fsDriver = parent.mount.type;
          const hostPath = path.join(fsDriver.realPath(parent), name);

          try {
            const stat = fs.statSync(hostPath);
            const mode = stat.isDirectory() ? 16895 : 33188; // DIR vs FILE mode
            const node = fsDriver.createNode(parent, name, mode, 0);
            node.usedBytes = stat.size;
            return node;
          } catch (e) {
            throw new FS.ErrnoError(44); // ENOENT (File not found)
          }
        },
        readdir: function (node) {
          const fsDriver = node.mount.type;
          const hostPath = fsDriver.realPath(node);
          try {
            return [".", "..", ...fs.readdirSync(hostPath)];
          } catch (e) {
            throw new FS.ErrnoError(44);
          }
        }
      },
      file: {
        getattr: function (node) {
          const fsDriver = node.mount.type;
          const hostPath = fsDriver.realPath(node);
          try {
            const stat = fs.statSync(hostPath);
            return {
              dev: 1,
              ino: node.id,
              mode: node.mode,
              nlink: 1,
              uid: 0,
              gid: 0,
              rdev: 0,
              size: stat.size,
              atime: stat.atime,
              mtime: stat.mtime,
              ctime: stat.ctime,
              blksize: 4096,
              blocks: Math.ceil(stat.size / 512)
            };
          } catch (e) {
            throw new FS.ErrnoError(44);
          }
        }
      }
    },

    stream_ops: {
      directory: {},
      file: {
        open: function (stream) {
          const fsDriver = stream.node.mount.type;
          const hostPath = fsDriver.realPath(stream.node);
          try {
            // Store physical file descriptor on the stream object
            stream.nfd = fs.openSync(hostPath, "r");
          } catch (e) {
            throw new FS.ErrnoError(44);
          }
        },
        close: function (stream) {
          if (stream.nfd) {
            try {
              fs.closeSync(stream.nfd);
            } catch (e) {}
          }
        },
        read: function (stream, buffer, offset, length, position) {
          try {
            // Buffer is a Uint8Array view into WASM memory
            const nodeBuffer = Buffer.from(buffer.buffer, buffer.byteOffset + offset, length);
            const bytesRead = fs.readSync(stream.nfd, nodeBuffer, 0, length, position);
            return bytesRead;
          } catch (e) {
            throw new FS.ErrnoError(29); // EIO
          }
        },
        llseek: function (stream, offset, whence) {
          let position = offset;
          if (whence === 1) { // SEEK_CUR
            position += stream.position;
          } else if (whence === 2) { // SEEK_END
            const fsDriver = stream.node.mount.type;
            const hostPath = fsDriver.realPath(stream.node);
            position += fs.statSync(hostPath).size;
          }
          return position;
        }
      }
    }
  };
}

module.exports = { createCustomNodeFS };