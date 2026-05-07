package com.skillstorm.investment_deal_room_backend.enums;

public enum ActivityType {

    DEAL_CREATED("created the deal"),
    DEAL_UPDATED("updated deal details"),
    STAGE_ADVANCED("advanced the stage"),
    STAGE_REVERTED("reverted the stage"),
    COUNTERPARTY_LINKED("linked a counterparty"),
    COUNTERPARTY_UNLINKED("removed a counterparty");

    private final String description;

    ActivityType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

}
