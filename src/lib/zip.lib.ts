import * as fs from 'fs';
import JSZip = require('jszip');

export class Zip {
    private zip: JSZip = new JSZip();
    private defaultOptions: JSZip.JSZipGeneratorOptions = {
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9
        }
    };

    private files: string[] = [];

    constructor(
        private file: string
    ) {
    }

    public add(fileInZIP: string, fileInSystem: string): Zip {
        this.files.push(fileInSystem);
        this.zip.file(fileInZIP, fs.createReadStream(fileInSystem));

        return this;
    }

    public async save(options: JSZip.JSZipGeneratorOptions = this.defaultOptions): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const content: any = await this.zip.generateAsync(options);
            fs.writeFile(this.file, content, (err) => {
                if (err) {
                    return reject(err);
                }

                this.clear();
                resolve(this.file);
            });
        });
    }

    private clear(files: string[] = this.files): void {
        setTimeout(() => {
            files.forEach((file) => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            });
        }, 30000);
    }
}
