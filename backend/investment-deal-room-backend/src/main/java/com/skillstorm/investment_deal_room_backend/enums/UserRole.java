package com.skillstorm.investment_deal_room_backend.enums;

public enum UserRole {
    ANALYST("Analyst"),
    DEAL_MANAGER("DealManager");

    private final String displayName;

    UserRole(String displayName){
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return this.displayName;
    }
}

