import React from 'react';
import { HubCreatorWorkspace } from '@/components/creator-studio/HubCreatorWorkspace';

/**
 * Success Creator
 * ---------------
 * Full Slide Studio toolchain (Blueprint + Slide Builder + Library)
 * locked to the Success hub.
 */
const SuccessCreator: React.FC = () => <HubCreatorWorkspace hub="success" />;

export default SuccessCreator;
