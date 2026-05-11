import React from 'react';
import { HubCreatorWorkspace } from '@/components/creator-studio/HubCreatorWorkspace';

/**
 * Playground Creator
 * ------------------
 * Full Slide Studio toolchain (Blueprint + Slide Builder + Library)
 * locked to the Playground hub.
 */
const PlaygroundCreator: React.FC = () => <HubCreatorWorkspace hub="playground" />;

export default PlaygroundCreator;
