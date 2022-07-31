export interface IBmlsService {
    getBmlsByQuery(query: any): Promise<any>;
    getSearchResults(query: any): Promise<any>;
    download(query: any): Promise<any>;
    getStatus(key: string, fileName: any): Promise<any>;
}
