package com.skillstorm.investment_deal_room_backend.enums;

public enum Currency {
    USD("US Dollar", "$"),
    EUR("Euro",      "€"),
    GBP("British Pound", "£"),
    JPY("Japanese Yen",  "¥"),
    CHF("Swiss Franc",   "CHF"),
    CAD("Canadian Dollar","CA$"),
    AUD("Australian Dollar","A$"),
    HKD("Hong Kong Dollar", "HK$"),
    SGD("Singapore Dollar", "S$"),
    CNY("Chinese Yuan",   "¥"),
    INR("Indian Rupee",   "₹"),
    BRL("Brazilian Real", "R$"),
    KRW("South Korean Won","₩"),
    SEK("Swedish Krona",   "kr"),
    NOK("Norwegian Krone", "kr"),
    DKK("Danish Krone",    "kr"),
    AED("UAE Dirham",      "د.إ"),
    SAR("Saudi Riyal",     "﷼");

    private final String displayName;
    private final String symbol;

    Currency(String displayName, String symbol) {
        this.displayName = displayName;
        this.symbol = symbol;
    }

    public String getDisplayName() {
        return displayName;
    }
 
    public String getSymbol() {
        return symbol;
    }
}
