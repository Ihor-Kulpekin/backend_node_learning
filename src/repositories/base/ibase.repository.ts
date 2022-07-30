export interface IBaseRepository<T> {
    getOne(_id: string): Promise<any>;
    getMany(query: any): Promise<any>;
    count(query: any): Promise<any>;
}
