package com.tothenew.journalApp.scheduler;

import com.tothenew.journalApp.cache.AppCache;
import com.tothenew.journalApp.entity.JournalEntry;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.enums.Sentiment;
import com.tothenew.journalApp.repository.UserRepositoryImpl;
import com.tothenew.journalApp.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class UserScheduler {
    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepositoryImpl userRepository;

    @Autowired
    private AppCache appCache;

//    this method is scheduled to run at every 10 minuts using cron scheduled job
    @Scheduled(cron = "0 */10 * * * *")
    public void fetchUserAndSendMail() {
        List<User> users = userRepository.getUserForSA();
        for (User user : users) {
            List<JournalEntry> journalEntries = user.getJournalEntries();
            List<Sentiment> sentiments = journalEntries.stream()
                    .filter(entry -> entry.getDate().isAfter(LocalDateTime.now().minusDays(7)))
                    .map(JournalEntry::getSentiment)
                    .filter(s -> s != null)
                    .collect(Collectors.toList());

            Map<Sentiment, Long> sentimentCounts = sentiments.stream()
                    .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

            Sentiment mostFrequentSentiment = sentimentCounts.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);

            if (mostFrequentSentiment != null) {
                emailService.sendEmail(user.getEmail(), "Sentiment for last 7 days: ", mostFrequentSentiment.toString());
            }
        }
    }
    @Scheduled(cron = "0 */10 * * * *")
    public void clearAppCache(){
            appCache.init();
    }
}
