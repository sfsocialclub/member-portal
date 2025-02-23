import { IScannerProps, Scanner } from '@yudiel/react-qr-scanner';

/**
 * https://github.com/yudielcurbelo/react-qr-scanner
 */
export const QRScanner = ({ onScan }: { onScan: IScannerProps['onScan'] }) => {
    return <Scanner onScan={onScan} allowMultiple={true} />;
}