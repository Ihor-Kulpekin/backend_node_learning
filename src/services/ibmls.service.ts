export interface IBmlsService {
    getBmlsByQuery(query: any): Promise<any>;
    getSearchResults(query: any): Promise<any>;
}
