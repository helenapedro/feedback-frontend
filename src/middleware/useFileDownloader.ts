const useFileDownloader = () => {
     const downloadFile = (url: string, fileName: string) => {
         const link = document.createElement('a');
         link.href = url;
         link.download = fileName;
         link.click();
     };
 
     return { downloadFile };
 };
 
 export default useFileDownloader;
 