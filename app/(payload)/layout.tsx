import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import config from '../../payload.config';
import { importMap } from './admin/importMap';
import '@payloadcms/next/css';

type Args = {
  children: React.ReactNode;
};

const serverFunction = async function (args: any) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

export default function Layout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
