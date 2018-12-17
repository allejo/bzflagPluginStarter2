export interface ILicense {
    name: string;
    body: string;
}

export const NullLicense: ILicense = {
    name: 'Proprietary',
    body: 'All rights reserved.',
};
