/**
 * HelpService gRPC client types
 * TypeScript interfaces for gRPC HelpService client
 */

export interface HelpServiceClient {
  getHelpSections(request: any): Promise<any>;
  getHelpContent(request: any): Promise<any>;
  searchHelp(request: any): Promise<any>;
  getFAQ(request: any): Promise<any>;
  trackHelpUsage(request: any): Promise<void>;
}
