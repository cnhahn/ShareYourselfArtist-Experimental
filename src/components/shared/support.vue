<template>
  <v-container>
    <v-parallax class="hidden-sm-and-down"  src="/static/images/4.jpg" height="350"></v-parallax>

    <h5 class="headline header mt-4">
      Support / FAQs
      <span>
        <a class="ml-3" style="font-size:.6em" href="mailto:nick@shareyourselfartists.com?Subject=Support" target="_top">Send us an email</a>
      </span>
    </h5>

    <v-layout column>

      <v-container style="margin-top: -25px; margin-bottom: -15px;">
        <v-list id="titleList">
          <template v-for="FAQ in FAQs">
            <p class="title question" v-if="FAQ.title" v-bind:key="FAQ.title">
              <a :name="returnAnchor(FAQ.anchor)" :href="returnAnchor(FAQ.anchor)" style="text-decoration: none; margin-left: -15px; font-size: .9em;">{{ FAQ.title }}</a>
            </p>
          </template>
        </v-list>
      </v-container>

      <v-divider class="mb-1"></v-divider>

      <v-container style="display: table; margin-left: -15px;">
        <template v-for="FAQ in FAQs">
          <div v-if="FAQ.title" v-bind:key="FAQ.title">
            <p class="title question">
              <a :name="FAQ.anchor" :href="returnAnchor(returnAnchor(FAQ.anchor))" style="text-decoration: none; font-size: .9em;">{{ FAQ.title }}</a>
            </p>
            <p class="body-1" style="font-size: 1.1em !important">{{FAQ.body}}</p>
          </div>

          <v-divider
            class="dividerFAQ"
            v-bind:key="FAQ.title"
            v-else-if="FAQ.divider"
            :inset="FAQ.inset"
          ></v-divider>
        </template>
      </v-container>

      <v-divider class="mb-5"></v-divider>

    </v-layout>


  </v-container>
</template>


<script>
  export default {
    data() {
      return {
        FAQs: [
          {
            title: '1. What the heck even is this website?',
            body: 'Share Yourself Artists is a community of the best internet artists and publications. ' +
            'Artists save tons of time and are exposed to new resources of exposure for less. ' +
            'For less than 2 quarters presubmission, artists can easily submit their artwork to, ' +
            'and possibly be featured on, the largest blogs in the art community. By purchasing a credit, ' +
            'the artists is entitled to feedback, critiques, or appraisals from the publication. \n' +
            'Share Yourself Artists also offers hardworking bloggers and publications to receive an income ' +
            'for sharing incredible artwork.',
            anchor: 'anchor-one'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: '2. Can I submit more than one piece?',
            body: "Yes you may! Our user interface allows artists to upload as many pieces as their hearts " +
            "may possibly desire. " +
            "Credits can be used on any and all of artists's works.",
            anchor: 'anchor-two'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: '3. Can I pay for credits without a monthly plan?',
            body: 'Yes you may! Our one time purchase deal is 8 credits for $5.',
            anchor: 'anchor-three'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: '4. How can I sign up as a blog?',
            body: 'Blog Signup Options can be found with the Artist Sign-up. ' +
            'You will then be directed to upload and description page where you can set up your Publication Account. ' +
            'PLEASE NOTE: There is a 25,000 follower minimum for blogs/magazines.',
            anchor: 'anchor-four'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: '5. Do I have to pay to use Share Yourself Artists?',
            body: 'Nope. Standard credits are completely free.',
            anchor: 'anchor-five'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: '6. How can I sign up my blog/magazine/publication?',
            body: 'Head to www.shareyourselfartists.com/business_signup for more information!',
            anchor: 'anchor-six'
          },
          {
            divider: true,
            inset: false
          },
           {
            title: '7. What is the difference between standard and premium credits?',
            body: 'Credits are used to send your song to a blog. There are two types: standard and premium.' +
                  "When you use a premium credit, your submission filters to the top of that blog's dashboard." +
                  ' The blog you send to then has to:' + 
                  '1) respond within 48 hours (96 hours for labels);' +
                  '2) listen to at least 20 seconds;'+
                  '3) approve the song, or provide a minimum of 10 words explaining why it was not a good fit.'+ 
                  'If they do not satisfy these requirements, you get your credit back to be used again.' + 
                  'Premium credits tend to have a higher approval rate because blogs are encouraged to spend time with the song, rather than making a split-second decision.'+
                  'With standard credits, there are no such requirements: a blog can choose to provide feedback if they wish, ' +
                 ' but may instead make a quick decision and move onto the next song. You receive two standard credits every four hours, and should see a countdown on the submit page that indicates when they will refresh.',
            anchor: 'anchor-seven'
          },
          {
            divider: true,
            inset: false
          },
           {
            title: '8. If I want to use premium credits, how much do they cost?',
            body: 'Premium credits start at about 65-70 cents per credit. When buying a monthly credit package, however, credits are as low as 40 cents per credit.',
            anchor: 'anchor-eight'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: '9. Where does the money go?',
            body: 'The majority of money from premium purchases goes to the blogs. The rest goes toward transaction fees, hosting fees, and salaries so that we can keep making Share Yourself Artists better.',
            anchor: 'anchor-nine'
          },
          {
            divider: true,
            inset: false
          },
           {
            title: '10. Does using Share Yourself Artists guarantee I will get on blogs?',
            body: "I'm afraid not. SYA’s mission is to connect blogs with people who want their work promoted. We make the process transparent, and work to improve the chances that you'll actually hear back after sending your masterpiece out. That said, we cannot force a blog to share your submission. That's entirely up to them :)",
            anchor: 'anchor-ten'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: "11. I've got credits. Now what?",
            body: "Click 'Upload My Art' in the sidebar...  Once there, you'll be able to add a new art piece, or select one you've already uploaded. After you've done that, you can then select the type of credit you'd like to use, and choose the blogs you want to send your art to.",
            anchor: 'anchor-eleven'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: '12. How do blogs get paid?',
            body: 'Blogs get paid at least $0.15 per response given. Larger and more active publications will be ' +
            'given an increased rate all the way up to $0.50 per submission(will likely increase in the future). ' +
            'Blogs are required to write a 50 character response to each photo.' +
            ' A blog could easily respond to 100 submissions per hour, earning them a wage of $15/per hour. ' +
            'With these calculations the largest blogs can make up to $50/per hour.\n',
            anchor: 'anchor-twelve'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: "13. What is Share Yourself Artists's Refund Policy",
            body: 'Although all credit purchases are final, each artist will be refunded each credit for any blog ' +
            'that does not respond or comment on their submission. Share Yourself Artists wants to help artists get ' +
            'seen by large players in the art industry, not make artists pay to be ignored.',
            anchor: 'anchor-thirteen'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: '14. How do I find your FAQ page?',
            body: 'The FAQ Page can be found by clicking the refresh button located next to your web browser.',
            anchor: 'anchor-fourteen'
          }

        ],
        artistName: '',
        artTitle: '',
        artUrl: '',
        description: ''
      }
    },
    methods: {
      returnAnchor(anchor) {
        return "#" + anchor
      }
    }

  }
</script>

<style>
  .header {
    font-weight: bolder;
    margin-bottom: 3vh;
  }

  .question {
    font-weight: bolder;
  }

  .passage {
    font-weight: normal;
    font-size: 1em !important;
  }

  .dividerFAQ {
    color: black;
    margin-bottom: 2vh;
  }
</style>
