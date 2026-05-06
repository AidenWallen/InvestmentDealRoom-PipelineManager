package com.skillstorm.investment_deal_room_backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.dao.DuplicateKeyException;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkCounterpartyDealRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.request.LinkDealCounterpartyRequestDto;
import com.skillstorm.investment_deal_room_backend.dtos.dealDtos.response.DealCounterpartyResponseDto;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.DuplicateResourceExceptions.DealCounterpartyAlreadyExistsException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.CounterpartyNotFoundException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.DealCounterpartyNotFoundException;
import com.skillstorm.investment_deal_room_backend.globalExceptionHandler.exceptions.NotFoundExceptions.DealNotFoundException;
import com.skillstorm.investment_deal_room_backend.models.Counterparty;
import com.skillstorm.investment_deal_room_backend.models.Deal;
import com.skillstorm.investment_deal_room_backend.models.DealCounterparty;
import com.skillstorm.investment_deal_room_backend.repositories.DealCounterpartyRepository;

@Service
public class DealCounterpartyService {

    private final DealCounterpartyRepository dcpRepository;

    private final DealService dealService;

    private final CounterpartyService counterpartyService;

    private final DealActivityService dealActivityServices;

    public DealCounterpartyService(DealCounterpartyRepository dcpRepository, CounterpartyService counterpartyService,
            DealActivityService dealActivityServices, DealService dealService) {
        this.dcpRepository = dcpRepository;
        this.dealService = dealService;
        this.counterpartyService = counterpartyService;
        this.dealActivityServices = dealActivityServices;
    }

    public List<DealCounterpartyResponseDto> getCounterpartiesByDealId(String dealId) {
        List<DealCounterparty> list = dcpRepository.findByDealId(dealId);

        if (list.isEmpty())
            throw new DealNotFoundException(dealId);

        return list.stream()
                .map(DealCounterpartyResponseDto::fromEntity)
                .toList();
    }

    public List<DealCounterpartyResponseDto> getDealsByCounterpartyId(String counterpartyId) {
        List<DealCounterparty> list = dcpRepository.findByCounterpartyId(counterpartyId);

        if (list.isEmpty())
            throw new CounterpartyNotFoundException(counterpartyId);

        return list.stream()
                .map(DealCounterpartyResponseDto::fromEntity)
                .toList();
    }

    @Transactional
    public DealCounterpartyResponseDto linkDealToCounterparty(
            String dealId,
            LinkDealCounterpartyRequestDto request) {

        try {
            Deal deal = dealService.getDealEntityById(dealId);

            counterpartyService.getCounterpartyEntityById(request.counterpartyId());

            DealCounterparty dealCounterparty = request.toEntity(deal.getId());

            DealCounterparty saved = dcpRepository.save(dealCounterparty);

            return DealCounterpartyResponseDto.fromEntity(saved);
        } catch (DuplicateKeyException e) {
            throw new DealCounterpartyAlreadyExistsException(dealId, request.counterpartyId());
        }
    }

    @Transactional
    public DealCounterpartyResponseDto linkCounterpartyToDeal(
            String counterpartyId,
            LinkCounterpartyDealRequestDto request, String userName) {

        try {
            Counterparty counterparty = counterpartyService.getCounterpartyEntityById(counterpartyId);

            dealService.getDealEntityById(request.dealId());

            DealCounterparty dealCounterparty = request.toEntity(counterparty.getId());
            DealCounterparty saved = dcpRepository.save(dealCounterparty);

            
            dealActivityServices.logCounterpartyLink(request.dealId(), userName, counterpartyId, counterparty.getOrganizationName(), dealCounterparty.getDealRole());
            
            return DealCounterpartyResponseDto.fromEntity(saved);
        } catch (DuplicateKeyException e) {
            throw new DealCounterpartyAlreadyExistsException(request.dealId(), counterpartyId);
        }
    }

    @Transactional
    public void unlinkDealCounterparty(String dealId, String counterpartyId, String userName) {
        DealCounterparty dcp  = getDealCounterpartyEntityById(dealId, counterpartyId);
        Counterparty counterP = counterpartyService.getCounterpartyEntityById(counterpartyId);

        dealActivityServices.logCounterpartyUnlink(dealId, userName, counterpartyId, counterP.getOrganizationName(), dcp.getDealRole());

        dcpRepository.delete(dcp);
    }

    public final DealCounterparty getDealCounterpartyEntityById(String dealId, String counterpartyId) {
        return dcpRepository.findByDealIdAndCounterpartyId(dealId, counterpartyId)
                .orElseThrow(() -> new DealCounterpartyNotFoundException(dealId, counterpartyId));
    }

}
