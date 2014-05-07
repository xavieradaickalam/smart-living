package com.sap.hs.dbl;

import org.junit.Assert;
import org.junit.Test;

public class DummyClassIT {

    @Test
    public void test() {
        DummyClass dummyClass = new DummyClass();
        dummyClass.setName("test");
        Assert.assertTrue("test".equals(dummyClass.getName()));
    }

}
