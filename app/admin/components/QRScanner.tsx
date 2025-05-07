import { IScannerProps, Scanner } from '@yudiel/react-qr-scanner';
import { bleepBase64 } from '../constants/bleep';

/**
 * https://github.com/yudielcurbelo/react-qr-scanner
 */
export const QRScanner = ({ onScan }: { onScan: IScannerProps['onScan'] }) => {
    return <Scanner
        onScan={onScan}
        allowMultiple={true}
        scanDelay={3500}
        // @ts-ignore - not typed in current version
        sound={bleepBase64}
    />;
}