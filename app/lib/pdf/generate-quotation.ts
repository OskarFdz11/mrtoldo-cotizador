// // app/lib/pdf/generate-quotation.ts
// import { generateSimpleQuotationHTML } from "./simple-template";

// export async function generateQuotationPDF(
//   quotationData: any
// ): Promise<Buffer> {
//   let browser;
//   let page;

//   try {
//     browser = await puppeteer.launch({
//       headless: true,
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//         "--disable-accelerated-2d-canvas",
//         "--no-first-run",
//         "--no-zygote",
//         "--disable-gpu",
//         "--disable-extensions",
//         "--disable-background-timer-throttling",
//         "--disable-renderer-backgrounding",
//         "--disable-backgrounding-occluded-windows",
//         "--disable-ipc-flooding-protection",
//         "--memory-pressure-off",
//         "--max_old_space_size=4096",
//       ],
//       timeout: 60000, // 60 segundos timeout
//     });

//     page = await browser.newPage();

//     // Aumentar timeouts y configurar la página
//     await page.setDefaultNavigationTimeout(60000);
//     await page.setDefaultTimeout(60000);

//     // Configurar viewport
//     await page.setViewport({
//       width: 1200,
//       height: 800,
//       deviceScaleFactor: 1,
//     });

//     // Generar HTML
//     const html = generateQuotationHTML(quotationData);
//     // const html = generateSimpleQuotationHTML(quotationData); // En lugar de generateQuotationHTML

//     // Cargar HTML con timeout extendido
//     await page.setContent(html, {
//       waitUntil: "domcontentloaded", // Cambiar de 'networkidle0' a 'domcontentloaded'
//       timeout: 30000,
//     });

//     // Esperar un poco más para asegurar que todo se renderice
//     await new Promise((res) => setTimeout(res, 2000));

//     // Verificar que la página está lista
//     await page.evaluate(() => {
//       return new Promise((resolve) => {
//         if (document.readyState === "complete") {
//           resolve(true);
//         } else {
//           window.addEventListener("load", () => resolve(true));
//         }
//       });
//     });

//     // Generar PDF con configuración más robusta
//     const pdf = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: {
//         top: "10mm",
//         right: "10mm",
//         bottom: "10mm",
//         left: "10mm",
//       },
//       preferCSSPageSize: false,
//       timeout: 30000, // 30 segundos timeout para PDF
//     });

//     return Buffer.from(pdf);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     const errorMessage =
//       typeof error === "object" && error !== null && "message" in error
//         ? (error as { message: string }).message
//         : String(error);
//     throw new Error(`Failed to generate PDF: ${errorMessage}`);
//   } finally {
//     try {
//       if (page && !page.isClosed()) {
//         await page.close();
//       }
//       if (browser && browser.connected) {
//         await browser.close();
//       }
//     } catch (closeError) {
//       console.error("Error closing browser:", closeError);
//     }
//   }
// }
