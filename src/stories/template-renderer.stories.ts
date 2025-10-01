import { Meta, StoryObj } from '@storybook/angular';
import { Template } from '../app/core/Models/operational/card-template.model';
import { TemplateRendererComponent } from '../app/features/organization/templates/template-renderer/template-renderer.component';

export const mockTemplate: Template = {
  id: 1,
      frontBackgroundUrl: 'https://drgxicjtijjdhrvsjgvd.supabase.co/storage/v1/object/public/Templates/ladoprincipal.svg',
      backBackgroundUrl: 'https://drgxicjtijjdhrvsjgvd.supabase.co/storage/v1/object/public/Templates/ladotrasero.svg',
      frontElementsJson: {
        qr: { x: 332, y: 48 },
        underQrText: { x: 302, y: 115 },
        companyName: { x: 70, y: 78 },
        logo: { x: 7, y: 97 },
        userPhoto: { x: -16, y: -1 },
        name: { x: 240, y: 209 },
        profile: { x: 240, y: 333 },
        categoryArea: { x: 138, y: 371 },
        phoneNumber: { x: 46, y: 502 },
        bloodTypeValue: { x: 379, y: 462 },
        email: { x: 144, y: 560 },
        cardId: { x: 164, y: 603 },
      },
      backElementsJson: {
        title: { x: 91, y: 202 },
        guides: { x: 36, y: 371 },
        address: { x: 43, y: 568 },
        phoneNumber: { x: 269, y: 568 },
        email: { x: 271, y: 590 },
      },
      isDeleted: false,
      code: null,
};

const meta: Meta<TemplateRendererComponent> = {
  title: 'Playground/TemplateRenderer',
  component: TemplateRendererComponent,
};
export default meta;

type Story = StoryObj<TemplateRendererComponent>;

export const Default: Story = {
  args: {
    template: mockTemplate,
  },
};


