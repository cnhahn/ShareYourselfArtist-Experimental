<template>
  <v-container>
    <v-parallax class="hidden-sm-and-down"  src="/static/images/4.jpg" height="400"></v-parallax>

    <h1 class="display-1 header">Support/FAQs</h1>
  <a href="mailto:nick@shareyourselfartists.com?Subject=Support" target="_top">Send us an email</a>
    <v-layout column>
      <v-container>
        <v-list id="titleList">
          <template v-for="FAQ in FAQs">
            <p class="title question" v-if="FAQ.title">
              <a :name="returnAnchor(FAQ.anchor)" :href="returnAnchor(FAQ.anchor)" style="text-decoration: none">{{ FAQ.title }}</a>
            </p>
          </template>
        </v-list>
      </v-container>

      <v-container style="display: table">
        <template v-for="FAQ in FAQs">
          <div v-if="FAQ.title">
            <p class="title question">
              <a :name="FAQ.anchor" :href="returnAnchor(returnAnchor(FAQ.anchor))" style="text-decoration: none">{{ FAQ.title }}</a>
            </p>
            <p class="subheading passage">{{ FAQ.body }}</p>
          </div>

          <v-divider
            class="dividerFAQ"
            v-else-if="FAQ.divider"
            :inset="FAQ.inset"
          ></v-divider>
        </template>
      </v-container>

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
            title: '5. How do blogs get paid?',
            body: 'Blogs get paid at least $0.15 per response given. Larger and more active publications will be ' +
            'given an increased rate all the way up to $0.50 per submission(will likely increase in the future). ' +
            'Blogs are required to write a 50 character response to each photo.' +
            ' A blog could easily respond to 100 submissions per hour, earning them a wage of $15/per hour. ' +
            'With these calculations the largest blogs can make up to $50/per hour.\n',
            anchor: 'anchor-five'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: "6. What is Share Yourself Artists's Refund Policy",
            body: 'Although all credit purchases are final, each artist will be refunded each credit for any blog ' +
            'that does not respond or comment on their submission. Share Yourself Artists wants to help artists get ' +
            'seen by large players in the art industry, not make artists pay to be ignored.',
            anchor: 'anchor-six'
          },
          {
            divider: true,
            inset: false
          },
          {
            title: '7. How do I find your FAQ page?',
            body: 'The FAQ Page can be found by clicking the refresh button located next to your web browser.',
            anchor: 'anchor-seven'
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
  }

  .dividerFAQ {
    color: black;
    margin-bottom: 2vh;
  }
</style>
