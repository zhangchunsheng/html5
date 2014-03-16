/// <reference path="TheShodo.js" />
/// <reference path="TheShodo.Shodo.Core.js" />

if (!TheShodo.Shodo) TheShodo.Shodo = {};

// ----------------------------------------------------------------------------

TheShodo.Shodo.Brush = function (brushName, opt) {
    this.name           = brushName;
    this.width          = opt.width;
    this.height         = opt.height;
    this.maxSize        = opt.maxSize || opt.width;
    this.minSize        = opt.minSize || 0;
    this.brushImageName = opt.brushImageName || brushName;
    //this.image          = TheShodo.Shodo.Resources.getImage('Brushes', this.brushImageName);
}
TheShodo.Shodo.Brush.prototype.draw = function (ctx, pos, size) {
    /// <summary></summary>
    /// <param name="ctx"></param>
    /// <param name="pos"></param>
    /// <param name="size"></param>
    ctx.drawImage(this.image,
        pos.x - (size/2),
        pos.y - (size/2),
        size,
        size);
}

TheShodo.Shodo.Brushes = {
    Small: new TheShodo.Shodo.Brush('Small', {
        width  : 90,
        height : 90,
        maxSize: 15,
        minSize: 3,
        brushImageName: 'Medium'
    })
    , Middle: new TheShodo.Shodo.Brush('Middle', {
        width  : 90,
        height : 90,
        maxSize: 40,
        minSize: 3,
        brushImageName: 'Medium'
    })
    , Medium: new TheShodo.Shodo.Brush('Medium', {
        width  : 90,
        height : 90,
        maxSize: 40,
        minSize: 3
    })
    , Large: new TheShodo.Shodo.Brush('Large', {
        width  : 90,
        height : 90,
        maxSize: 60,
        minSize: 3,
        brushImageName: 'Medium'
    })
    , getBrush : function (brushName) {
        /// <summary>get stroke brush by name</summary>
        if (!this[brushName].image) {
            this[brushName].image = TheShodo.Shodo.Resources.getImage('Brushes', brushName);
            this[brushName].kasureImage = TheShodo.Shodo.Resources.getImage('KasureBrushes', brushName);
        }
        return this[brushName];
    }
}


TheShodo.Shodo.Resources = {
    createImage: function (url) {
        var image = document.createElement('img');
        image.src = url;
        return image;
    }

    , getImage: function (category, name) {
        return this[category][name];
    }
}

TheShodo.Shodo.Resources.Write = {
    ClearAnimationInk: TheShodo.Shodo.Resources.createImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAcCAYAAAB2+A+pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAf9JREFUeNq8lrsvQ3EUx29f3kGUaCME8Yik8UpMJhFLFwtikVhNBn+A1SARsZgtEjEZxcAkYvCoBQlqIqh6VpVe39N8r9w0+uL+nOST+8u96e/bc87vnN+xadmZDTSDUuAkT8AFwiACYuANPGa7YSqrBCOgk5vLughcgRKuC8EzOKboPZgEt9ofbAxcAh3E+UxeJyOCa2AGtAF7tmISyiYwDo7ANfhMI5SOFeDOVrgbzDN/+h8JAX8mQTdzs2uBoJlDMAtGQcVPwoM8GDGLhQ0WQIFZ0MHnO09qB0vEShPhauAFeeDE/LEHBBV5ayDltgiKNR53F5uDV1NrUiHrrJKEsI8161IsXAf66XlC2MkcfGrqrZ3RTRyuKNgAraBRoajkOR8EpDnZWegtoFaxtzamM2iEWv5FH2j4h1Cf85L5tl6+1BXzAobNDSTG0+1T7LGTt9aBcW09gA/erarzLA0kYgjLBLHFfh1XLL4K9swv5JBN0XsV+Q1R1Jequ1woEJUoTpu7Y/JoEmYY4gpyW5tp3y5eXVZ6vMPpJq05mIdl/ij2i7DqbBRyDc7lWqZ+TplnaUSiFPrgWmdJysgzxH2Kc52rPbzGBkA9pweZQKvozTbYBzWc2TwU3gRL4PS3A71hJTyNMihMsO0F6NUNv92BMvDKcrS83ZVbtdmXAAMArYo2cGf7G3sAAAAASUVORK5CYII='),
    String: {
          SendErrorOnDone: 'An error occurred while sending. Please try again'
        , Error: 'An error occurred'
        , ClearPanel_Body: 'Clear?'
    }
}

TheShodo.Shodo.Resources.Brushes = {
    _Medium: TheShodo.Shodo.Resources.createImage("data:image/png;base64,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"),
    Small: TheShodo.Shodo.Resources.createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAOOSURBVHja7JxfhFRRHMfPNAzLsAzDEvu0REQZNjHEUC89xRI9TeplX3uKEkv0usxTbCKWlrVPPSR6SL1sdm12FWvZlNKIsllapUy/0/yuPffOnZlz555zu+fe75eP/Wt29nPPnPs7/6bQ6XQEYj9HoACiIRqBaIiGaASiIRqBaIiGaASiIRqBaIjOeeR8tIqSElEjJmDJgNcBomfl7yvsEgvERWIcKs2ILhI7AdEqP4lF4hyUxhNdHyA5yA63/jHojS66FUG0x1dijqhAs77ojRFEe+wT88RRiB4susR9cCcm8jHuEccgOlz0lAHJQR4RDYj2i65ZEK2WiLfz0K3oiK5bFK3ylJjJ6oAo6LUQ3KlUKBRO0IfNhJ/XB+KVwjbRdl20z2uIaPmy/piS5yuFfyde89dviQP+/JNyMQ74Z06JFlyilR1uUN4F+UVs8ffafHG2+RX0Lg2i1/immPVssfCXxBPlohgX3W/AMp/QDTFtyNHtCtGMO6WgOzK8kFPRKl94SqFqU7S8mj8g2zfCLdsQLfMQkn1sRmndUUTXIbeHFzwXZFR03Fm8rDJnQ/QMxIb22cdNiy6iVfftQoomRaOv7s+sadGCyxvI7R3cVEyLrvADQ7Cfu6ZFy1yF2NAb45Rp0RjE9F+mMy5aDkPfQG4PddOiBdeQ+5DrYyNY7pkQLXMJcgeXe6ZEy1yH3J5yb8KGaMHlDSQf8sCWaJlFCPaVe9Uw0SZ2/F8hlgUieAq1qTeCGS1FftmgVfOeGBtdh5oWRP9j3LZomTsQLRo2+uhgbhHXePNKXtOzidPW8bf7xHnh+P65GBlLSrTMc+K0yd0/DqVtq+oYdnXzNus3mcTNcND8yF4OJO/aGrDoZok4JbobCrOcJZsDlqiDm5vCzIGkNLbmchIDliiRp7WeZa1+tjmpFDfNjCz8tmzNR5uMXGWXWxp+O7zCUnJBtLpMtuKY5D0Rcmg17aK9TIvutisXVlWmtYqMlIr2cpZ4nFLJq6LPng4XRatdykJKSsLPxOVhT9hV0V7kMtEN8f/2lrSE5hEL10WrqfE/nkRp+F503+JIO1kSrabBCw6rFsq2kd5dR+csuOtzDVW+iZ7hiuCk0D9R9UccnkdfjjMvo3tyNmuR8ie5ZYYdi5CnZ78R66b+4FDRiJ3gnRwhGqIRiIZoiIYCiIZoBKIhGqIRiIZoBKIhGqIRiM5Q/gowAMsRJLrK/gy+AAAAAElFTkSuQmCC"),
    Medium: TheShodo.Shodo.Resources.createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAOOSURBVHja7JxfhFRRHMfPNAzLsAzDEvu0REQZNjHEUC89xRI9TeplX3uKEkv0usxTbCKWlrVPPSR6SL1sdm12FWvZlNKIsllapUy/0/yuPffOnZlz555zu+fe75eP/Wt29nPPnPs7/6bQ6XQEYj9HoACiIRqBaIiGaASiIRqBaIiGaASiIRqBaIjOeeR8tIqSElEjJmDJgNcBomfl7yvsEgvERWIcKs2ILhI7AdEqP4lF4hyUxhNdHyA5yA63/jHojS66FUG0x1dijqhAs77ojRFEe+wT88RRiB4susR9cCcm8jHuEccgOlz0lAHJQR4RDYj2i65ZEK2WiLfz0K3oiK5bFK3ylJjJ6oAo6LUQ3KlUKBRO0IfNhJ/XB+KVwjbRdl20z2uIaPmy/piS5yuFfyde89dviQP+/JNyMQ74Z06JFlyilR1uUN4F+UVs8ffafHG2+RX0Lg2i1/immPVssfCXxBPlohgX3W/AMp/QDTFtyNHtCtGMO6WgOzK8kFPRKl94SqFqU7S8mj8g2zfCLdsQLfMQkn1sRmndUUTXIbeHFzwXZFR03Fm8rDJnQ/QMxIb22cdNiy6iVfftQoomRaOv7s+sadGCyxvI7R3cVEyLrvADQ7Cfu6ZFy1yF2NAb45Rp0RjE9F+mMy5aDkPfQG4PddOiBdeQ+5DrYyNY7pkQLXMJcgeXe6ZEy1yH3J5yb8KGaMHlDSQf8sCWaJlFCPaVe9Uw0SZ2/F8hlgUieAq1qTeCGS1FftmgVfOeGBtdh5oWRP9j3LZomTsQLRo2+uhgbhHXePNKXtOzidPW8bf7xHnh+P65GBlLSrTMc+K0yd0/DqVtq+oYdnXzNus3mcTNcND8yF4OJO/aGrDoZok4JbobCrOcJZsDlqiDm5vCzIGkNLbmchIDliiRp7WeZa1+tjmpFDfNjCz8tmzNR5uMXGWXWxp+O7zCUnJBtLpMtuKY5D0Rcmg17aK9TIvutisXVlWmtYqMlIr2cpZ4nFLJq6LPng4XRatdykJKSsLPxOVhT9hV0V7kMtEN8f/2lrSE5hEL10WrqfE/nkRp+F503+JIO1kSrabBCw6rFsq2kd5dR+csuOtzDVW+iZ7hiuCk0D9R9UccnkdfjjMvo3tyNmuR8ie5ZYYdi5CnZ78R66b+4FDRiJ3gnRwhGqIRiIZoiIYCiIZoBKIhGqIRiIZoBKIhGqIRiM5Q/gowAMsRJLrK/gy+AAAAAElFTkSuQmCC"),
    /* compat */Middle: TheShodo.Shodo.Resources.createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAOOSURBVHja7JxfhFRRHMfPNAzLsAzDEvu0REQZNjHEUC89xRI9TeplX3uKEkv0usxTbCKWlrVPPSR6SL1sdm12FWvZlNKIsllapUy/0/yuPffOnZlz555zu+fe75eP/Wt29nPPnPs7/6bQ6XQEYj9HoACiIRqBaIiGaASiIRqBaIiGaASiIRqBaIjOeeR8tIqSElEjJmDJgNcBomfl7yvsEgvERWIcKs2ILhI7AdEqP4lF4hyUxhNdHyA5yA63/jHojS66FUG0x1dijqhAs77ojRFEe+wT88RRiB4susR9cCcm8jHuEccgOlz0lAHJQR4RDYj2i65ZEK2WiLfz0K3oiK5bFK3ylJjJ6oAo6LUQ3KlUKBRO0IfNhJ/XB+KVwjbRdl20z2uIaPmy/piS5yuFfyde89dviQP+/JNyMQ74Z06JFlyilR1uUN4F+UVs8ffafHG2+RX0Lg2i1/immPVssfCXxBPlohgX3W/AMp/QDTFtyNHtCtGMO6WgOzK8kFPRKl94SqFqU7S8mj8g2zfCLdsQLfMQkn1sRmndUUTXIbeHFzwXZFR03Fm8rDJnQ/QMxIb22cdNiy6iVfftQoomRaOv7s+sadGCyxvI7R3cVEyLrvADQ7Cfu6ZFy1yF2NAb45Rp0RjE9F+mMy5aDkPfQG4PddOiBdeQ+5DrYyNY7pkQLXMJcgeXe6ZEy1yH3J5yb8KGaMHlDSQf8sCWaJlFCPaVe9Uw0SZ2/F8hlgUieAq1qTeCGS1FftmgVfOeGBtdh5oWRP9j3LZomTsQLRo2+uhgbhHXePNKXtOzidPW8bf7xHnh+P65GBlLSrTMc+K0yd0/DqVtq+oYdnXzNus3mcTNcND8yF4OJO/aGrDoZok4JbobCrOcJZsDlqiDm5vCzIGkNLbmchIDliiRp7WeZa1+tjmpFDfNjCz8tmzNR5uMXGWXWxp+O7zCUnJBtLpMtuKY5D0Rcmg17aK9TIvutisXVlWmtYqMlIr2cpZ4nFLJq6LPng4XRatdykJKSsLPxOVhT9hV0V7kMtEN8f/2lrSE5hEL10WrqfE/nkRp+F503+JIO1kSrabBCw6rFsq2kd5dR+csuOtzDVW+iZ7hiuCk0D9R9UccnkdfjjMvo3tyNmuR8ie5ZYYdi5CnZ78R66b+4FDRiJ3gnRwhGqIRiIZoiIYCiIZoBKIhGqIRiIZoBKIhGqIRiM5Q/gowAMsRJLrK/gy+AAAAAElFTkSuQmCC"),
    Large: TheShodo.Shodo.Resources.createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAOOSURBVHja7JxfhFRRHMfPNAzLsAzDEvu0REQZNjHEUC89xRI9TeplX3uKEkv0usxTbCKWlrVPPSR6SL1sdm12FWvZlNKIsllapUy/0/yuPffOnZlz555zu+fe75eP/Wt29nPPnPs7/6bQ6XQEYj9HoACiIRqBaIiGaASiIRqBaIiGaASiIRqBaIjOeeR8tIqSElEjJmDJgNcBomfl7yvsEgvERWIcKs2ILhI7AdEqP4lF4hyUxhNdHyA5yA63/jHojS66FUG0x1dijqhAs77ojRFEe+wT88RRiB4susR9cCcm8jHuEccgOlz0lAHJQR4RDYj2i65ZEK2WiLfz0K3oiK5bFK3ylJjJ6oAo6LUQ3KlUKBRO0IfNhJ/XB+KVwjbRdl20z2uIaPmy/piS5yuFfyde89dviQP+/JNyMQ74Z06JFlyilR1uUN4F+UVs8ffafHG2+RX0Lg2i1/immPVssfCXxBPlohgX3W/AMp/QDTFtyNHtCtGMO6WgOzK8kFPRKl94SqFqU7S8mj8g2zfCLdsQLfMQkn1sRmndUUTXIbeHFzwXZFR03Fm8rDJnQ/QMxIb22cdNiy6iVfftQoomRaOv7s+sadGCyxvI7R3cVEyLrvADQ7Cfu6ZFy1yF2NAb45Rp0RjE9F+mMy5aDkPfQG4PddOiBdeQ+5DrYyNY7pkQLXMJcgeXe6ZEy1yH3J5yb8KGaMHlDSQf8sCWaJlFCPaVe9Uw0SZ2/F8hlgUieAq1qTeCGS1FftmgVfOeGBtdh5oWRP9j3LZomTsQLRo2+uhgbhHXePNKXtOzidPW8bf7xHnh+P65GBlLSrTMc+K0yd0/DqVtq+oYdnXzNus3mcTNcND8yF4OJO/aGrDoZok4JbobCrOcJZsDlqiDm5vCzIGkNLbmchIDliiRp7WeZa1+tjmpFDfNjCz8tmzNR5uMXGWXWxp+O7zCUnJBtLpMtuKY5D0Rcmg17aK9TIvutisXVlWmtYqMlIr2cpZ4nFLJq6LPng4XRatdykJKSsLPxOVhT9hV0V7kMtEN8f/2lrSE5hEL10WrqfE/nkRp+F503+JIO1kSrabBCw6rFsq2kd5dR+csuOtzDVW+iZ7hiuCk0D9R9UccnkdfjjMvo3tyNmuR8ie5ZYYdi5CnZ78R66b+4FDRiJ3gnRwhGqIRiIZoiIYCiIZoBKIhGqIRiIZoBKIhGqIRiM5Q/gowAMsRJLrK/gy+AAAAAElFTkSuQmCC")
}
     
TheShodo.Shodo.Resources.KasureBrushes = {
    Small: TheShodo.Shodo.Resources.createImage("data:image/png;base64,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"),
    Medium: TheShodo.Shodo.Resources.createImage("data:image/png;base64,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"),
    /* compat */Middle: TheShodo.Shodo.Resources.createImage("data:image/png;base64,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"),
    Large: TheShodo.Shodo.Resources.createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAD8hJREFUeNrsXGtsZVUV3uec++jTdqadmXZgeAmKqCCgxmiMBp+J0WgMGvUHEVRAY/QPKshTjRjjDxMDgwghMT5+GSI+Eo1EFB+IICovHR7CMFNmaDvTebS3vefec1yr/Zb9ZnE6007bcRjOSVbu7Xndfb699re+tfY+jfI8D+W2+ltcQlACXQJdbiXQJdAl0OVWAl0CXW4l0CXQJdDlVgJdAl1uJdBH6VbhP6Io8p2gx9uwclvkVlR6rixwbiK2TuxlYnvFHhWbKSFcIY+23hDP7pWv54t9Qmy32DfEmmLvFPud2H1y3qicF89dUs4eLBlobF1i54qdIjYuVhPbBpD/JbZfQO6QzxPFpuX7hO4TvEuKWSLQShe3ir1FbEjs/WJXgKvHwN967MM4/06xewXw5/RaAbxVQrs4oOvqoWJPAPRxUMcz6sHw5PPEXin2pNh6sXfhmr8J4I8I2CWnLwLoC+C9VykHg0J0mxLrBa2cC89+WOw3CJ4fAI9fLmBvE7CbJcQL6GgB6PMA7HR48QTAbIhV4c1vFXupWI9YHzxabYPYJnRgS+7VJVYtYS726Ich7/4Mb3652B/FUnjzq8SOQwfo8dfCm7sgB0fQQTkkYS5gJ7h2H85T+mm9mNSKB1ozlgfByT2ggTvE9gB8DXIdkHsT8OIvwrtjgHwdPjn7UdXyErqn6vIHAPiLYovYqcTzNAi+Cdys+vk2sV8DXKWI58gzc4A5BEqJ4MnP4lgLHWne/iXc73MAWFXMDo0F0obM0Vfs9x1rHp3DMxXUv8K7TxPbKDYKKpjE8QSA7YPH18lDe8DpCvKlYr/E/p1il6FjKvgt5fIIHaX3VIA7ZdcUjvfr6HmhS0YfDDOAtg1Dex8AfgzfZ0AX6uEniZ2A4HcKOqMGENWDOzEqNov9Q+wasa0wBe1KsWFHW2YNdLr+1mf1U3lerOY+Yw22yFBfUEBbQnK/ZYAAKwaIpwGwDoCvgHxL7Bdit4idjftMgGIy0M200QSNHAa4jg6qwWx/FUqmSnSUO2sh4OpWgUXoBO2MuuugOHLVsyNWaTLDpl70drE1AHgN1MSbxe4SewSAV7D/MTyw8vOfxN6I47fC6+sAay2+W6dtQmeo9w9gBHTiWIJz9fqTsS/CtQl+O6EREOOzQvsq6KAeSNIe/FZMNGXXaqA+ARjEdh5js1wrGnJT4Ob9aKxSwsegNF4Nz0zRSPWmp2EBUu96PJhZAB3th0dH8PSd6Bzj/RRmXLwORa02QInRoRn2WRnXOsc6YSMF5zbiySfxOUNBPHOjqq2jASCfjvuuXsKCYb4LD1wHj/ZCTfxc7AsAuxvnXgxARvCAG3EfBe0iANbEQ+fkcQG/kQGANj18htiwGdTTJm8N9GnUkRKnX4rfNJrR+9xEur+K2HIivgc4wRhGnl63RdsEGqqthryzMqmB0QH5NohTGuDsMTz4SeRht8MbHsfDpujIHeiQhEA0j8pp+MYUJzICtJv2tej6Cu2z9tZAQ2Po3ECe30Ox4Cocu5rk6Ea0ezPanBEGOWRoc0WBtu8Ax4Zhih/vwt/6eTwaoR5/CTxnGxpvwz/C3xElPQaYAZxRgIwIoDZ+vwrgWnSOXZe5TszdPao4rjHiUwjadnwHzjc+H4B3T+IzEKfP3kfw2b/SQCfozQQP2SRP60fDM6iOQSQg99ND1+AlfeD8Fvb1kSZPiHcHEB/0mnfjnjciS42cl8cUI3K0M3XnGJhV6oRB3C+loFqjkgF3Vuo4PAZvd+ikx0pV76yBZwFUDVxPIai10TBL0yehIMbJM6YBQgN8bxw9AE7fTF6u+09FbVuvf4/YmeDU2bKr1rpxT/a+pvPcOkCbcYBnNBJ2AeA2ATtN98rc86+DU6QkTbuxb8WAzuF9HwdgD6C4tIVUQjdKpA3y+gbduwMg7KbAtBkcGqjxmgz9W+xC1LhrCGzXAui78T0jFcI0Yd6cUucx/eT0exGKYpapZgUjJqKs9rti24nrMxntPUulkIMBnQLUCIWgN4i9RuxnYvcAtFHUQp7BsI9cJ12OBn8G5xjYmVM+U6CdFJ5+HsDohn6/kyggcl5bITA9zwfabx2wjoLhNeBp5mLbzCn2YbQEjMhZGapga7sXXZPxCYv7WwPeh5CUpNDL3xP7IOjCUu5+eOAgJRM9KFB9H0mHJSqdLt02RWCq4BWQhXcA0KehzxOnmc3Del0SU6ekxyc1FRw/mZIpO68DndCDDu6gUdmLfSfgbz3n9bpvsQlL5RD90ABdqH7+KLzyNnDnWfDCPfTwVcq+6giCV0AL56Q2fNrfIK/aAi97EgpmGNfWnRavUm07oqAWEUUkJA1zCrxbiTJ4BE+SLG1RTX0G+0w2psiQm8tWHbSvihqGyrebMTGQkSfFALJFD2eSqkG8aZldQhE9cpGdE5o2Jh3ei+Gr9/oJPq0+YkAEeFpG8pG1eeT0ua/B+78TCqC5o1qWmMrVe1cEaOyvYahZ4lFDIOkFd98L7wtEB4F6vEIg110ykTpNnLvEZhAqZDuUzwypgkHi/E5K4dvEuRl1QtOBF+NY0wXFuCCocjYb8HsqRYcFs7sPJwUv4vGm2BaAtBaAT2Eo3YMGDRGgOTXSGtwGEPvxYOb5Q0QrnGRYzVpl3m8pTkSUDFm6HZMnc4XQqGYaHRQ5zk7CgUve6nR/25eg6FRzz1Sf98PZqmC0bKDtbghMCu5eKgI1sW+SHoI9JHIcGdHD9yBbG3TDuOU8q0YPbe0eh/QapyGd09D3UjUUpPxcJwlO4rFEbbqkJkLsML4/81BFqEUDjYnUlLK6CkXxFOBn5KkZPTQrjhrVl5+DhNqFqF4nEHLnwV7rtqlOERfUuK3c2edkbOYyQC412Aiwurjp9mlHR0aZddhHVIUdbAJiSTMT+dw2hYDUQi/vooftcnxWpyDURgc1nUc9S8WbjM7NC+rNEbU5c4HTTwYYJ09S+zhA5gUzO/ybAzh3huRfnRKk++Aour0OGW3/igDtvJuVggExSelq5O7fJiBTpwAyKItmQTIT0XU1qo8E8vqUhnpC1zFPx6T5K3T/mNRLRNVK4/+cgu16Go3/gZNlOE9LCGcstI7lsOfaAPYQ1MggZWgxeWgfJRN1+kyKpqPcTImNkOA8PSH6qbqMMLiEJXfeGpPkDARicAE2gNJG6d416oTjUbvuJArV2abzF/LqSljGJlhvlx4cJZ6rUfCoOzCt5NlBCQpzqiUfGTmABasqvs8UqAamqbxg9HBwmybQcxcsEwTWmxHc25QoDQPUpyh5qUGBbUL7elEu6CsqOi0LaAKDszHjxE58b7kacYv2BeqkhCjFpN5MKH7bICmQkKxW8gIOLgqYRTXsKcyTNnBsLaqLj6E41gTNWSJ3LfR0QvOSYcWB1qIKateBasSB+DovWNLgy5B5wbnMz20HRijwxpar1IUFpr58Jpq7GZuU5jKtPDBFIAfqgEvwDMEVvFaOox3YbSxC76dgxJo3celwTny4AcOTJ05rbpqqTlzYSYlRuyDoBVdcsmMtV/GrUNKRU5sy4mFre1cB1aiDXIc84D6eKMAk78oDTYCPUuSvUOHHKnvcYCtDjhM3cw2ZaxPduLab5vBy+q3gPD5zNYlQkDxlLrkxpaEz4F9GMWwdaORCmparEk3twfqXywhsC5pLr3UseX5srjZSgZdWSVq1aEhGrqYQFXhNVKB9czfkqzTsO3D/1NVOkoJ5ydxJwRhgT+Azx8y+qZHdVkgK86tiz0ZJ4VFUM69C7X1EcNy3ah7NtRF4qTV+PQ2tYZrwTcLzVy95gNnD2+SNOUk2mwPsJ9mX0PUJqaKNtCDHlwnGMWp2ILU2jb4Tbeuh803SToP+AjpmJhSskl21NWuYedDs6tOYaRmgOcP1bgI1LwhMieNTnyHyEoOchng3KYbglI7Rw4CrQ+ek3XeFA1c6mYyrAkSLH1qt/DsC5bdx3+8g060eEepwQWEDGr2DAs4oeWEgz6wDqBma4F1DgbLlPNoyNttvZdMWJRmDSJVTUjpjroI4iFrNALWpBdDbqN7th0a2yWWbzNC14TeIfQ21em3rOYLjXSutow/m1S3UkYO9k0hrPrw8s8DZcms4WpRopE53d+A6q0PvdJ48AAm2GcPaFnG2CHT91JVWP8W5J4JeRgDqViqIjeFeE/jb2jmCNui+AQ/yqnv0AqXWhHiXZyy6YeMuyYkJvJw0uNFIJxWsKsSPmZscaDlvtZVJtwCkPTj3VOzT7QLU27toZidDO4dAH/r3Gah1/EA7RjAcP2IcfZD6CE+S1ok2bN0FZ41MPZFTH02qBhqNcDnTruGOY8k4inT7WRplu1AsehzcexHAt8kKWwOyF+m4TbHp+T8Mc68Adhz2VNYqe3fbRf6IkhQLnjcBjIy4l2nE6uC2wHIH1UFSAtrW8TWpI1IqgllSM4zftzJuf5hfKpbTrPhEmF92vMdiUdHbCf83oB3gfpTZuukJBMNxN+vSCY9jxaIgfwX7roZ3DlAg5CJUy8UpUx1r6fxeGnGn4FqbSToHUm877qdvqv1BsPvnitajV4FO6q5eUAXI0/AoS6f7APwaRyMRqOCrsLGCWgSvqePKnunzNXR+JzrJptyeAKgmHsaQpGzF96fC/EKccFRRxwLeHbtskTshpSQncfOSNTeZkJO0G6daB0u+MdLQ5u0bwLtWyp2kQH02aOwGSmb+N8GrJeMVmTM8Qt6dgd/aJPsSAsT4teHS9mY4cAGkUc8UvJMTiPVu9pynw8wrh8L8SqXjAfLXxd4n9s0wt9LpOAB/SJCPOo8u8PCEvDWmOnRMHpy7glLiZl4SCog14t4xKq1ynSVGMNyDzrgZks9e2ZhERqhvFusKrr8IZod8MbUSjuINpdcG5uFqAKgBMDYB6BHy+IhoJqPJA66F2/vtbSctOT50k4qwd3EyBFjN/n4c5hZ3bg+L/M88RzXQBLit4DSlsRG14BQVsxHy+Bp5Ohd7UpKCTJt+CUQfOjGmOkoTycntAFl1876lvN37ggDaFaqUUtSzbsTwt0WW5vG2REDXWV8PgC+GbOtBshGoZj5M2WY3TVXtBhfrb+nizh+J/WohnXxMAU1bA4X22f+QIMD3wzO7oDI0mF0Jffsgpd27w4Gv4HEFcYYyP3uP/W1hbtnx78PcKq3Jw31H/agOhocZQBVsXdDyDmhhrVs8RJrZskAr4g+CaxuUFFWgKizdXvb/izoWgbbMsTPMLyGoIoEZA8Wcg9MfomrhbFao8QDZ6mxVcKX+p8jzgD5Gt4gqhbaGJEBnZ+74soE95D8YPIb/IQy/zpaH+XcIi46vylb+b9IjtJVAl0CXQJdbCXQJdAl0CUEJdAl0uZVAl0CXQJdbCXQJdLmVQJdAv8i3/wowAB67shmMoEzNAAAAAElFTkSuQmCC")
}