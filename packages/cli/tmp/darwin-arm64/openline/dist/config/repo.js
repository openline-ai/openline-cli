"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepos = void 0;
function getRepos() {
    const repos = {};
    repos.baseUrl = 'https://github.com/openline-ai/';
    repos.cli = 'openline-cli';
    repos.contacts = 'openline-contacts';
    repos.customerOs = 'openline-customer-os';
    repos.hubspot = 'openline-hubspot-integration';
    repos.oasis = 'openline-oasis';
    repos.uiKit = 'openline-ui-kit';
    repos.voice = 'openline-voice';
    repos.website = 'openline.ai';
    repos.webchat = 'openline-web-chat';
    repos.zendesk = 'openline-zendesk-integration';
    return repos;
}
exports.getRepos = getRepos;
