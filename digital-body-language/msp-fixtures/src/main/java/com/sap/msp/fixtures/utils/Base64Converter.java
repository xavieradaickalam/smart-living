package com.sap.msp.fixtures.utils;

import java.io.*;

public class Base64Converter {
    private static byte[] Base64EncMap = null;
    private static byte[] Base64DecMap = null;
    
    static {
        // rfc-2045: Base64 Alphabet
        byte[] map = {
        (byte)'A', (byte)'B', (byte)'C', (byte)'D', (byte)'E', (byte)'F',
        (byte)'G', (byte)'H', (byte)'I', (byte)'J', (byte)'K', (byte)'L',
        (byte)'M', (byte)'N', (byte)'O', (byte)'P', (byte)'Q', (byte)'R',
        (byte)'S', (byte)'T', (byte)'U', (byte)'V', (byte)'W', (byte)'X',
        (byte)'Y', (byte)'Z',
        (byte)'a', (byte)'b', (byte)'c', (byte)'d', (byte)'e', (byte)'f',
        (byte)'g', (byte)'h', (byte)'i', (byte)'j', (byte)'k', (byte)'l',
        (byte)'m', (byte)'n', (byte)'o', (byte)'p', (byte)'q', (byte)'r',
        (byte)'s', (byte)'t', (byte)'u', (byte)'v', (byte)'w', (byte)'x',
        (byte)'y', (byte)'z',
        (byte)'0', (byte)'1', (byte)'2', (byte)'3', (byte)'4', (byte)'5',
        (byte)'6', (byte)'7', (byte)'8', (byte)'9', (byte)'+', (byte)'/' };

        Base64EncMap = map;
        Base64DecMap = new byte[128];
        for (int idx=0; idx < Base64EncMap.length; idx++)
            Base64DecMap[Base64EncMap[idx]] = (byte) idx;
    }
    
    /**
     * 
     */
    private Base64Converter() {
        super();
    }

    /**
     * utility method used to decode text strings
     * @param aValue
     * @return
     */
    public static ByteArrayInputStream decodeText(String aValue) {
        // convert from base64
        byte[] base8Data = null;
        base8Data = base64Decode(aValue.getBytes());
        return new ByteArrayInputStream(base8Data);
    }
    
    /**
     * utility method used to encode 
     * @param aValue
     * @return
     * @throws java.io.IOException
     */
    public static String encodeText(InputStream aValue)
        throws IOException
    {
        String result = null;
        if(aValue != null && aValue.available() > 0) {
            // encode base8 data into base64 for XML output
            //
            byte[] base8Data = new byte[aValue.available()];
            aValue.read(base8Data);

            byte[] base64Data = base64Encode(base8Data);
        
            //  then to a string for inclusion in the XML
            //
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            baos.write(base64Data);
            result = baos.toString();
        }
        return result;
    }
    
    /**
     * utility method to encode blob data
     * @param aValue
     * @return
     * @throws IOException
     */
    public static String encodeText(File aValue) throws IOException {
        String result = null;
        if (aValue != null && aValue.exists()) {
            FileInputStream in = new FileInputStream(aValue);
            try {
                result = encodeText(in);
            } finally {
                in.close();
            }
        }
        return result;
        
    }

    /**
     * This method decodes the given byte[] using the base64-encoding
     * specified in RFC-2045 (Section 6.8).
     *
     * @param  data the base64-encoded data.
     * @return the decoded <var>data</var>.
     */
    public static byte[] base64Decode(byte[] data) {
        if (data == null)  {
            return  null;
        }

        int tail = data.length;
        while (data[tail-1] == '=') { 
            tail--;
        }

        byte dest[] = new byte[tail - data.length/4];


        // ascii printable to 0-63 conversion
        for (int idx = 0; idx <data.length; idx++) {
            data[idx] = Base64DecMap[data[idx]];
        }

        // 4-byte to 3-byte conversion
        int sidx, didx;
        for (sidx = 0, didx=0; didx < dest.length-2; sidx += 4, didx += 3) {
            dest[didx]   = (byte) ( ((data[sidx] << 2) & 255) | ((data[sidx+1] >>> 4) & 003) );
            dest[didx+1] = (byte) ( ((data[sidx+1] << 4) & 255) | ((data[sidx+2] >>> 2) & 017) );
            dest[didx+2] = (byte) ( ((data[sidx+2] << 6) & 255) | (data[sidx+3] & 077) );
        }
        if (didx < dest.length) {
            dest[didx]   = (byte) ( ((data[sidx] << 2) & 255) | ((data[sidx+1] >>> 4) & 003) );
        }
        if (++didx < dest.length) {
            dest[didx]   = (byte) ( ((data[sidx+1] << 4) & 255) | ((data[sidx+2] >>> 2) & 017) );
        }

        return dest;
    }

    /**
     * This method encodes the given byte[] using the base64-encoding
     * specified in RFC-2045 (Section 6.8).
     *
     * @param  data the data
     * @return the base64-encoded <var>data</var>
     */
    public static byte[] base64Encode(byte[] data)  {
        if (data == null) {
            return  null;
        }

        int sidx, didx;
        byte dest[] = new byte[((data.length+2)/3)*4];


        // 3-byte to 4-byte conversion + 0-63 to ascii printable conversion
        for (sidx=0, didx=0; sidx < data.length-2; sidx += 3) {
            dest[didx++] = Base64EncMap[(data[sidx] >>> 2) & 077];
            dest[didx++] = Base64EncMap[(data[sidx+1] >>> 4) & 017 | (data[sidx] << 4) & 077];
            dest[didx++] = Base64EncMap[(data[sidx+2] >>> 6) & 003 | (data[sidx+1] << 2) & 077];
            dest[didx++] = Base64EncMap[data[sidx+2] & 077];
        }
        if (sidx < data.length) {
            dest[didx++] = Base64EncMap[(data[sidx] >>> 2) & 077];
            if (sidx < data.length-1) {
                dest[didx++] = Base64EncMap[(data[sidx+1] >>> 4) & 017 | (data[sidx] << 4) & 077];
                dest[didx++] = Base64EncMap[(data[sidx+1] << 2) & 077];
            }
            else {
                dest[didx++] = Base64EncMap[(data[sidx] << 4) & 077];
            }
        }

        // add padding
        for ( ; didx < dest.length; didx++) {
            dest[didx] = (byte) '=';
        }

        return dest;
    }
}
