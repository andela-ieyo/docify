import { jsdom } from 'jsdom';

global.document = jsdom('<html><head><script src="https://cdn.ckeditor.com/4.7.0/standard/ckeditor.js"></script></head><body></body></html>');
