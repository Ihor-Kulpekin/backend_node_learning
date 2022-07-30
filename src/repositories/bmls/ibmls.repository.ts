export interface IBmlsRepository {
    getBmls(query: any): Promise<any>;
    getSearchResults(query: any): Promise<any>;
}
