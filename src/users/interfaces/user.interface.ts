export class UserInterface {
  _id: any;

  name: string;

  username: string;

  password: string;

  clickedLink: [
    {
      shortLinkId: string;
      countClick: number;
    },
  ];

  createdLink: [
    {
      _id?: any;

      linkToRedirect?: string;

      shortLink?: string;

      countClick?: number;
      userId?: string;
    },
  ];
}
