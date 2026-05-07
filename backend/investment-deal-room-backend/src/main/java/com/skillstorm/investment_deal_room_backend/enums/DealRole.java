package com.skillstorm.investment_deal_room_backend.enums;

public enum DealRole {
    ACQUIRER("Acquirer"),
    TARGET("Target"),
    ADVISOR("Advisor"),
    LENDER("Lender");

    private final String displayName;

    DealRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
