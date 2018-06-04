import { Injectable } from '@angular/core';
import * as corsProxy from 'cors-anywhere';

@Injectable({
  providedIn: 'root'
})
export class CorsProxyService {
  constructor() { }

  init() {
    corsProxy.createServer().listen(8080, 'localhost', () => {
      console.log('made request');
    });
  }
}
