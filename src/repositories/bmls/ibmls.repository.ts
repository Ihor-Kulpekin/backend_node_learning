export interface IBmlsRepository {
    getBmls(query: any): Promise<any>;
    getBml(id: string): Promise<any>;
    getSearchResults(query: any): Promise<any>;
}
