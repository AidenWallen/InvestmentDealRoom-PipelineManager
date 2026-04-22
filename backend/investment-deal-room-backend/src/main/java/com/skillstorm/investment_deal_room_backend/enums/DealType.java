package com.skillstorm.investment_deal_room_backend.enums;

public enum DealType {
    MERGER_ACQUISITION("Merger & Acquisition"),
    IPO("IPO"),
    DEBT_ISSUANCE("Debt Issuance"),
    PRIVATE_PLACEMENT("Private Placement");

    private final String displayName;
 
    DealType(String displayName) {
        this.displayName = displayName;
    }
 
    public String getDisplayName() {
        return displayName;
    }
}
