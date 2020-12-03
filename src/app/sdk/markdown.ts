import remark from "remark";
const html = require('remark-html')

export const markdownToHTML = async (markdown: string): Promise<string> => {

    return new Promise<string>(async (resolve, reject) => {
        let remarkInstance: any = remark();
        remarkInstance.use(html).process(markdown, (error: any, file: any) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(String(file));
            }
        });
    });
}