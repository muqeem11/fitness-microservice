package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class ActivityAiService {
    private final  GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity){
        String prompt= createPromptForActivity(activity);
        String aiResponse=geminiService.getRecommendation(prompt);
        log.info("RESPONSE FROM AI{}", aiResponse);
        return processAIResponse(activity,aiResponse);

    }

    private Recommendation processAIResponse(Activity activity, String aiResponse) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode= mapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .get("parts")
                    .get(0)
                    .path("text");
            String jsonContent= textNode.asText()
                    .replace("```json\\n","")
                    .replace("\\n```","")
                    .trim();

//            log.info("RESPONSE FROM CLEANED AI{}", jsonContent);
              JsonNode analysisJson= mapper.readTree(jsonContent);
              JsonNode analysisNode=analysisJson.path("analysis");

        }catch (Exception e){

        }
        return null;
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
              Analyze this fitness activity and provide detailed recommendations in the following  EXACT JSON format:
                {
                  "analysis": {
                     "overall": "Overall analysis here",
                     "pace": "Pace analysis here",
                     "heartRate": "Heart rate analysis here",
                     "caloriesBurned": "Calories burned analysis here",
                  },
                  "improvements": [
                    {
                      "area" : "Area name ",
                      "recommendation": "Detailed recommendation"
                    }
                  ],
                  "suggestions":[
                      {
                        "workout": "Workout name",
                        "description": "Detailed workout description"
                      }
                  ],
                  "safety":[
                       "Safety point 1",
                       "Safety point 2"
                  ],
                }
                Analyze  this activity:
                Activity Type: %s
                Duration :%d minutes
                Calories Burned: %d
                Additional Metrics: %s
              
                Provide detailed analysis focusing on performance, improvements , next workout suggestions, and safety guideline .
                Ensure the response follows the EXACT JSON format show above.""",
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
                );

    }


}
