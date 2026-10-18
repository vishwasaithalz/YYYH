import React from 'react';
import { StandaloneToolPageTemplate, StandaloneToolPageTemplateProps } from './StandaloneToolPageTemplate';
import { TOOL_PAGES, ToolPageData } from '../data/toolPagesData';
import { ActiveSiteView } from '../types';

export interface StandaloneToolViewProps {
  toolData?: ToolPageData;
  toolSlug?: string;
  onNavigate: (view: ActiveSiteView, path?: string) => void;
}

/**
 * StandaloneToolView delegating to the standardized StandaloneToolPageTemplate component.
 */
export const StandaloneToolView: React.FC<StandaloneToolViewProps> = ({ toolData, toolSlug, onNavigate }) => {
  const resolved = toolData || (toolSlug ? TOOL_PAGES[toolSlug] : undefined) || TOOL_PAGES['cidr-calculator'];
  return <StandaloneToolPageTemplate toolData={resolved} onNavigate={onNavigate} />;
};

export { StandaloneToolPageTemplate };
export type { StandaloneToolPageTemplateProps };
