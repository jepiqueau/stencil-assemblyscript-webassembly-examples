
export async function initWasm(source: string , importObject?: any) :Promise<any>  {
    let impObj:any = importObject ? importObject : {};
    return  await WebAssembly.instantiateStreaming(fetch(source),impObj);        
}
