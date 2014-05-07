package com.sap.hs.dbl;

import org.junit.Assert;
import org.junit.Test;

public class DummyClassTest {

    @Test
    public void test() {
        DummyClass dummyClass = new DummyClass();
        dummyClass.setName("test");
        Assert.assertTrue("test".equals(dummyClass.getName()));
    }

}
