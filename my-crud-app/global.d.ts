// global.d.ts
declare global {
    var mongoose: {
      conn: any;
      promise: Promise<any> | null;
    };
  }
  
  // Necessary to convert this file into a module
  export {};
  