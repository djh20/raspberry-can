/*
This module is a wrapper for the built-in 'fs' module.
It's much better than the default module, as it features promisies,
and it's just much easier to use overall.
*/

import * as nodeFS from 'fs';
import * as p from 'path';

namespace FileSystem {
  interface ReadFileParams {
    path: string;
    dir?: string;
    encoding?: BufferEncoding;
    json?: boolean;
  }
  interface FileData {
    data: string;
    json?: any;
  }
  interface ReadDirectoryParams {
    path: string;
    dir?: string;
  }
  interface DirectoryData {
    children: DirectoryChild[];
  }
  interface DirectoryChild {
    name: string;
    path: string;
  }

  export function writeFile(path: string, data: string | NodeJS.ArrayBufferView): Promise<boolean> {
    return new Promise((resolve, reject) => {
      nodeFS.writeFile(path, data, (err) => {
        !err ? resolve(true) : resolve(false);
      });
    });
  }

  export function readFile(params: ReadFileParams): Promise<FileData> {
    // if a directory is given, use path to get the full path
    if (params.dir) params.path = p.resolve(params.dir, params.path);

    return new Promise((resolve, reject) => {
      nodeFS.readFile(params.path, {encoding: params.encoding || 'utf-8'}, (err, data) => {
        resolve({
          data: data,
          json: params.json && data ? JSON.parse(data) : undefined
        });
      });
    });
  }
  
  export function createDirectory(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      nodeFS.mkdir(path, (err) => {
        !err ? resolve(true) : resolve(false);
      });
    });
  }
  
  export function readDirectory(params: ReadDirectoryParams): Promise<DirectoryData> {
    // if a directory is given, use path to get the full path
    if (params.dir) params.path = p.resolve(params.dir, params.path);

    return new Promise((resolve, reject) => {
      nodeFS.readdir(params.path, (err, data) => {
        let children: DirectoryChild[] = [];
        
        for (let file_name of data) {
          let path = p.resolve(params.path, file_name);
          children.push({name: file_name, path: path});
        }
        
        resolve({children: children});
      });
    });
  }
}

export default FileSystem;