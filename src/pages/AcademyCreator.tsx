import React from 'react';
import { HubCreatorWorkspace } from '@/components/creator-studio/HubCreatorWorkspace';

/**
 * Academy Creator
 * ---------------
 * Full Slide Studio toolchain (Blueprint + Slide Builder + Library)
 * locked to the Academy hub.
 */
const AcademyCreator: React.FC = () => <HubCreatorWorkspace hub="academy" />;

export default AcademyCreator;
